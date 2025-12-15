package main

import (
	"bytes"
	"fmt"
	"go/ast"
	"go/parser"
	"go/token"
	"os"
	"path/filepath"
	"strings"
)

type Analyzer struct {
	config            *Config
	fileSet           *token.FileSet
	files             map[string]*ast.File
	functions         map[string]*FunctionInfo
	functionCallNodes map[string]string // ノードID -> 関数呼び出し名のマッピング
}

type FunctionInfo struct {
	PackageName     string
	FileName        string
	FunctionName    string
	FullName        string
	ReceiverType    string
	MermaidCode     string
	CalledFunctions []string
	Comments        string
	SourceCode      string
}

func NewAnalyzer(config *Config) *Analyzer {
	return &Analyzer{
		config:            config,
		fileSet:           token.NewFileSet(),
		files:             make(map[string]*ast.File),
		functions:         make(map[string]*FunctionInfo),
		functionCallNodes: make(map[string]string),
	}
}

func (a *Analyzer) AnalyzeAllTargetFiles() (map[string]*FunctionInfo, error) {
	// ファイル読み込み
	files, err := expandGlob(a.config.TargetFiles)
	if err != nil {
		return nil, err
	}

	// 除外パターンでフィルタリング
	filteredFiles := a.filterFiles(files)

	for _, file := range filteredFiles {
		if err := a.parseFile(file); err != nil {
			if a.config.Verbose {
				fmt.Printf("警告: ファイル解析をスキップ: %s (%v)\n", file, err)
			}
			continue
		}
	}

	// 全関数を解析
	for fileName, file := range a.files {
		a.analyzeFunctionsInFile(fileName, file)
	}

	// 呼び出しグラフを構築
	a.buildCallGraph()

	return a.functions, nil
}

func (a *Analyzer) parseFile(fileName string) error {
	src, err := os.ReadFile(fileName)
	if err != nil {
		return err
	}

	file, err := parser.ParseFile(a.fileSet, fileName, src, parser.ParseComments)
	if err != nil {
		return err
	}

	a.files[fileName] = file
	return nil
}

func (a *Analyzer) analyzeFunctionsInFile(fileName string, file *ast.File) {
	packageName := file.Name.Name

	ast.Inspect(file, func(n ast.Node) bool {
		if funcDecl, ok := n.(*ast.FuncDecl); ok {
			funcInfo := a.analyzeSingleFunction(packageName, fileName, funcDecl)
			a.functions[funcInfo.FullName] = funcInfo
		}
		return true
	})
}

func (a *Analyzer) analyzeSingleFunction(packageName, fileName string, funcDecl *ast.FuncDecl) *FunctionInfo {
	receiverType := ""
	if funcDecl.Recv != nil && len(funcDecl.Recv.List) > 0 {
		receiverType = a.extractReceiverType(funcDecl.Recv.List[0].Type)
	}

	fullName := a.buildFullName(packageName, receiverType, funcDecl.Name.Name)

	// Mermaidコード生成（mermaid_oldベース）
	mermaidCode := a.generateMermaidCode(funcDecl)

	// 関数呼び出しを抽出
	calledFunctions := a.extractFunctionCalls(funcDecl)

	return &FunctionInfo{
		PackageName:     packageName,
		FileName:        fileName,
		FunctionName:    funcDecl.Name.Name,
		FullName:        fullName,
		ReceiverType:    receiverType,
		MermaidCode:     mermaidCode,
		CalledFunctions: calledFunctions,
		Comments:        a.extractComments(funcDecl),
	}
}

func (a *Analyzer) extractReceiverType(expr ast.Expr) string {
	switch t := expr.(type) {
	case *ast.Ident:
		return t.Name
	case *ast.StarExpr:
		if ident, ok := t.X.(*ast.Ident); ok {
			return ident.Name
		}
	}
	return ""
}

func (a *Analyzer) buildFullName(packageName, receiverType, functionName string) string {
	if receiverType != "" {
		return fmt.Sprintf("%s.%s.%s", packageName, receiverType, functionName)
	}
	return fmt.Sprintf("%s.%s", packageName, functionName)
}

func (a *Analyzer) extractComments(funcDecl *ast.FuncDecl) string {
	if funcDecl.Doc != nil {
		var comments []string
		for _, comment := range funcDecl.Doc.List {
			text := strings.TrimSpace(strings.TrimPrefix(comment.Text, "//"))
			if text != "" {
				comments = append(comments, text)
			}
		}
		return strings.Join(comments, " ")
	}
	return ""
}

func (a *Analyzer) extractFunctionCalls(funcDecl *ast.FuncDecl) []string {
	var calls []string
	callSet := make(map[string]bool)

	ast.Inspect(funcDecl.Body, func(n ast.Node) bool {
		if call, ok := n.(*ast.CallExpr); ok {
			if callName := a.extractCallName(call); callName != "" && !callSet[callName] {
				calls = append(calls, callName)
				callSet[callName] = true
			}
		}
		return true
	})

	return calls
}

func (a *Analyzer) extractCallName(call *ast.CallExpr) string {
	return a.extractExpressionName(call.Fun)
}

// 再帰的に式の名前を抽出する（複数のドットを含むセレクタに対応）
func (a *Analyzer) extractExpressionName(expr ast.Expr) string {
	switch e := expr.(type) {
	case *ast.Ident:
		return e.Name
	case *ast.SelectorExpr:
		base := a.extractExpressionName(e.X)
		if base != "" {
			return base + "." + e.Sel.Name
		}
		return e.Sel.Name
	}
	return ""
}

func (a *Analyzer) buildCallGraph() {
	// 呼び出しグラフの構築（将来の拡張用）
	for _, funcInfo := range a.functions {
		for _, calledFunc := range funcInfo.CalledFunctions {
			// 呼び出し関係の記録
			if a.config.Verbose {
				fmt.Printf("呼び出し: %s -> %s\n", funcInfo.FullName, calledFunc)
			}
		}
	}
}

// mermaid_oldベースのMermaid生成ロジック
func (a *Analyzer) generateMermaidCode(funcDecl *ast.FuncDecl) string {
	var nodes []string
	var edges []string
	edgeSet := make(map[string]bool)
	nodeCounter := 0

	// 各関数の生成時にfunctionCallNodesをリセット
	a.functionCallNodes = make(map[string]string)

	genNodeID := func() string {
		nodeCounter++
		return fmt.Sprintf("N%d", nodeCounter)
	}

	startID := genNodeID()
	structName := ""
	if funcDecl.Recv != nil && len(funcDecl.Recv.List) > 0 {
		structName = a.extractReceiverType(funcDecl.Recv.List[0].Type) + "."
	}

	nodes = append(nodes, fmt.Sprintf("%s([\"`**%s%s**`\"])", startID, structName, funcDecl.Name.Name))

	if funcDecl.Body != nil {
		a.parseBlockStmt(funcDecl.Body, startID, &nodes, &edges, edgeSet, genNodeID, false)
	}

	return a.formatMermaidOutput(nodes, edges)
}

func (a *Analyzer) parseBlockStmt(
	block *ast.BlockStmt,
	currentID string,
	nodes *[]string,
	edges *[]string,
	edgeSet map[string]bool,
	genNodeID func() string,
	suppressInitialEdge bool,
) string {
	firstNodeID := ""

	for _, stmt := range block.List {
		// コメントの取得
		comments := a.getComments(stmt)
		commentStr := strings.Join(comments, "\\n")

		switch s := stmt.(type) {
		case *ast.AssignStmt, *ast.ExprStmt, *ast.ReturnStmt:
			nodeID := genNodeID()
			var label string
			switch st := s.(type) {
			case *ast.AssignStmt:
				exprStr := a.stmtToString(st)
				if commentStr != "" {
					exprStr = commentStr + "\\n" + exprStr
				}
				label = a.escapeString(exprStr)
				*nodes = append(*nodes, fmt.Sprintf("%s[\"%s\"]", nodeID, label))
				// 関数呼び出しを検出して記録
				a.detectAndRecordFunctionCalls(st, nodeID)
			case *ast.ExprStmt:
				exprStr := a.exprToString(st.X)
				if commentStr != "" {
					exprStr = commentStr + "\\n" + exprStr
				}
				label = a.escapeString(exprStr)
				*nodes = append(*nodes, fmt.Sprintf("%s[\"%s\"]", nodeID, label))
				// 関数呼び出しを検出して記録
				a.detectAndRecordFunctionCalls(st, nodeID)
			case *ast.ReturnStmt:
				exprStr := a.stmtToString(st)
				if commentStr != "" {
					exprStr = commentStr + "\\n" + exprStr
				}
				label = a.escapeString(exprStr)
				*nodes = append(*nodes, fmt.Sprintf("%s([\"%s\"])", nodeID, label))
				// 関数呼び出しを検出して記録
				a.detectAndRecordFunctionCalls(st, nodeID)

				// return文の後に「終了」ノードを作成
				endNodeID := genNodeID()
				*nodes = append(*nodes, fmt.Sprintf("%s((\"終了\"))", endNodeID))
				a.addEdge(nodeID, endNodeID, edges, edgeSet)
			}
			if !suppressInitialEdge {
				a.addEdge(currentID, nodeID, edges, edgeSet)
			}
			suppressInitialEdge = false

			// 最初のノードIDを記録
			if firstNodeID == "" {
				firstNodeID = nodeID
			}
			currentID = nodeID
		case *ast.IfStmt:
			cond := a.exprToString(s.Cond)
			if commentStr != "" {
				cond = commentStr + "\\n" + cond
			}
			condID := genNodeID()
			label := a.escapeString(cond)
			*nodes = append(*nodes, fmt.Sprintf("%s{{\"%s\"}}", condID, label))
			if !suppressInitialEdge {
				a.addEdge(currentID, condID, edges, edgeSet)
			}
			suppressInitialEdge = false

			// if文の条件式内の関数呼び出しを検出して記録
			a.detectAndRecordFunctionCallsInExpr(s.Cond, condID)

			// 最初のノードIDを記録
			if firstNodeID == "" {
				firstNodeID = condID
			}

			// "Yes" 分岐 - ブロックの最初のノードに接続し、最後のノードIDを取得
			yesFirstID, yesLastID := a.parseBlockStmtWithFirstLast(s.Body, condID, nodes, edges, edgeSet, genNodeID, true)
			if yesFirstID != "" {
				a.addLabeledEdge(condID, "Yes", yesFirstID, edges, edgeSet)
			}

			// "No" 分岐の最初と最後のノードIDを取得
			var noFirstID, noLastID string
			if s.Else != nil {
				noFirstID, noLastID = a.parseElseStmtWithFirstLast(s.Else, condID, nodes, edges, edgeSet, genNodeID, true)
				a.addLabeledEdge(condID, "No", noFirstID, edges, edgeSet)
			} else {
				noID := genNodeID()
				*nodes = append(*nodes, fmt.Sprintf("%s[\"処理続行\"]", noID))
				a.addLabeledEdge(condID, "No", noID, edges, edgeSet)
				noFirstID = noID
				noLastID = noID
			}

			// 合流点の処理: if文の後に続く処理があるかチェック
			// 現在のステートメントのインデックスを取得して、次のステートメントがあるかチェック
			hasNextStmt := false
			for i, stmt := range block.List {
				if stmt == s && i < len(block.List)-1 {
					hasNextStmt = true
					break
				}
			}

			if hasNextStmt {
				// 合流点ノードを作成
				mergeID := genNodeID()
				*nodes = append(*nodes, fmt.Sprintf("%s[\"合流点\"]", mergeID))

				// 両方の分岐の最後から合流点に接続
				if yesLastID != "" {
					a.addEdge(yesLastID, mergeID, edges, edgeSet)
				}
				if noLastID != "" {
					a.addEdge(noLastID, mergeID, edges, edgeSet)
				}
				currentID = mergeID
			} else {
				// 次のステートメントがない場合は、条件ノードを次の起点とする
				currentID = condID
			}
		case *ast.RangeStmt:
			key := a.exprToString(s.Key)
			value := a.exprToString(s.Value)
			x := a.exprToString(s.X)
			rangeLabel := fmt.Sprintf("for %s, %s := range %s", key, value, x)
			if commentStr != "" {
				rangeLabel = commentStr + "\\n" + rangeLabel
			}
			rangeID := genNodeID()
			label := a.escapeString(rangeLabel)
			*nodes = append(*nodes, fmt.Sprintf("%s{{\"%s\"}}", rangeID, label))
			if !suppressInitialEdge {
				a.addEdge(currentID, rangeID, edges, edgeSet)
			}
			suppressInitialEdge = false

			// 最初のノードIDを記録
			if firstNodeID == "" {
				firstNodeID = rangeID
			}

			// ループ本体 - ブロックの最初のノードに接続
			bodyFirstID, bodyLastID := a.parseBlockStmtWithFirstLast(s.Body, rangeID, nodes, edges, edgeSet, genNodeID, true)
			if bodyFirstID != "" {
				a.addLabeledEdge(rangeID, "Body", bodyFirstID, edges, edgeSet)
				// ループの継続
				a.addEdge(bodyLastID, rangeID, edges, edgeSet)
			}
			currentID = rangeID
		}
	}
	return currentID
}

// parseBlockStmtWithFirstLast は最初と最後のノードIDを返すヘルパー関数
// return文がある場合は、最後のノードIDとして空文字列を返す（合流点に接続しないため）
func (a *Analyzer) parseBlockStmtWithFirstLast(
	block *ast.BlockStmt,
	currentID string,
	nodes *[]string,
	edges *[]string,
	edgeSet map[string]bool,
	genNodeID func() string,
	suppressInitialEdge bool,
) (string, string) {
	if len(block.List) == 0 {
		return "", currentID
	}

	firstNodeID := ""
	lastNodeID := currentID
	hasReturn := false

	for _, stmt := range block.List {
		// コメントの取得
		comments := a.getComments(stmt)
		commentStr := strings.Join(comments, "\\n")

		switch s := stmt.(type) {
		case *ast.AssignStmt, *ast.ExprStmt, *ast.ReturnStmt:
			nodeID := genNodeID()
			var label string
			switch st := s.(type) {
			case *ast.AssignStmt:
				exprStr := a.stmtToString(st)
				if commentStr != "" {
					exprStr = commentStr + "\\n" + exprStr
				}
				label = a.escapeString(exprStr)
				*nodes = append(*nodes, fmt.Sprintf("%s[\"%s\"]", nodeID, label))
				// 関数呼び出しを検出して記録
				a.detectAndRecordFunctionCalls(st, nodeID)
			case *ast.ExprStmt:
				exprStr := a.exprToString(st.X)
				if commentStr != "" {
					exprStr = commentStr + "\\n" + exprStr
				}
				label = a.escapeString(exprStr)
				*nodes = append(*nodes, fmt.Sprintf("%s[\"%s\"]", nodeID, label))
				// 関数呼び出しを検出して記録
				a.detectAndRecordFunctionCalls(st, nodeID)
			case *ast.ReturnStmt:
				exprStr := a.stmtToString(st)
				if commentStr != "" {
					exprStr = commentStr + "\\n" + exprStr
				}
				label = a.escapeString(exprStr)
				*nodes = append(*nodes, fmt.Sprintf("%s([\"%s\"])", nodeID, label))
				// 関数呼び出しを検出して記録
				a.detectAndRecordFunctionCalls(st, nodeID)
				hasReturn = true

				// return文の後に「終了」ノードを作成
				endNodeID := genNodeID()
				*nodes = append(*nodes, fmt.Sprintf("%s((\"終了\"))", endNodeID))
				a.addEdge(nodeID, endNodeID, edges, edgeSet)
			}
			if !suppressInitialEdge && lastNodeID != "" {
				a.addEdge(lastNodeID, nodeID, edges, edgeSet)
			}
			suppressInitialEdge = false

			// 最初のノードIDを記録
			if firstNodeID == "" {
				firstNodeID = nodeID
			}
			lastNodeID = nodeID
		case *ast.IfStmt:
			cond := a.exprToString(s.Cond)
			if commentStr != "" {
				cond = commentStr + "\\n" + cond
			}
			condID := genNodeID()
			label := a.escapeString(cond)
			*nodes = append(*nodes, fmt.Sprintf("%s{{\"%s\"}}", condID, label))
			if !suppressInitialEdge && lastNodeID != "" {
				a.addEdge(lastNodeID, condID, edges, edgeSet)
			}
			suppressInitialEdge = false

			// if文の条件式内の関数呼び出しを検出して記録
			a.detectAndRecordFunctionCallsInExpr(s.Cond, condID)

			// 最初のノードIDを記録
			if firstNodeID == "" {
				firstNodeID = condID
			}

			// "Yes" 分岐 - ブロックの最初のノードに接続
			yesFirstID, _ := a.parseBlockStmtWithFirstLast(s.Body, condID, nodes, edges, edgeSet, genNodeID, true)
			if yesFirstID != "" {
				a.addLabeledEdge(condID, "Yes", yesFirstID, edges, edgeSet)
			}

			// "No" 分岐
			if s.Else != nil {
				elseID := a.parseElseStmt(s.Else, condID, nodes, edges, edgeSet, genNodeID)
				a.addLabeledEdge(condID, "No", elseID, edges, edgeSet)
				lastNodeID = elseID
			} else {
				noID := genNodeID()
				*nodes = append(*nodes, fmt.Sprintf("%s[\"処理続行\"]", noID))
				a.addLabeledEdge(condID, "No", noID, edges, edgeSet)
				lastNodeID = noID
			}
		case *ast.RangeStmt:
			key := a.exprToString(s.Key)
			value := a.exprToString(s.Value)
			x := a.exprToString(s.X)
			rangeLabel := fmt.Sprintf("for %s, %s := range %s", key, value, x)
			if commentStr != "" {
				rangeLabel = commentStr + "\\n" + rangeLabel
			}
			rangeID := genNodeID()
			label := a.escapeString(rangeLabel)
			*nodes = append(*nodes, fmt.Sprintf("%s{{\"%s\"}}", rangeID, label))
			if !suppressInitialEdge && lastNodeID != "" {
				a.addEdge(lastNodeID, rangeID, edges, edgeSet)
			}
			suppressInitialEdge = false

			// 最初のノードIDを記録
			if firstNodeID == "" {
				firstNodeID = rangeID
			}

			// ループ本体 - ブロックの最初のノードに接続
			bodyFirstID, bodyLastID := a.parseBlockStmtWithFirstLast(s.Body, rangeID, nodes, edges, edgeSet, genNodeID, true)
			if bodyFirstID != "" {
				a.addLabeledEdge(rangeID, "Body", bodyFirstID, edges, edgeSet)
				// ループの継続
				a.addEdge(bodyLastID, rangeID, edges, edgeSet)
			}
			lastNodeID = rangeID
		}
	}

	// return文がある場合は、合流点に接続しないように空文字列を返す
	if hasReturn {
		return firstNodeID, ""
	}
	return firstNodeID, lastNodeID
}

func (a *Analyzer) parseElseStmt(
	elseStmt ast.Stmt,
	parentID string,
	nodes *[]string,
	edges *[]string,
	edgeSet map[string]bool,
	genNodeID func() string,
) string {
	switch stmt := elseStmt.(type) {
	case *ast.BlockStmt:
		firstID, _ := a.parseBlockStmtWithFirstLast(stmt, parentID, nodes, edges, edgeSet, genNodeID, true)
		return firstID
	case *ast.IfStmt:
		cond := a.exprToString(stmt.Cond)
		comments := a.getComments(stmt)
		if len(comments) > 0 {
			cond = strings.Join(comments, "\\n") + "\\n" + cond
		}
		condID := genNodeID()
		label := a.escapeString(cond)
		*nodes = append(*nodes, fmt.Sprintf("%s{{\"%s\"}}", condID, label))
		a.addEdge(parentID, condID, edges, edgeSet)

		// if文の条件式内の関数呼び出しを検出して記録
		a.detectAndRecordFunctionCallsInExpr(stmt.Cond, condID)

		// Yes分岐も最初のノードに接続するように修正
		yesFirstID, _ := a.parseBlockStmtWithFirstLast(stmt.Body, condID, nodes, edges, edgeSet, genNodeID, true)
		if yesFirstID != "" {
			a.addLabeledEdge(condID, "Yes", yesFirstID, edges, edgeSet)
		}

		if stmt.Else != nil {
			noID := a.parseElseStmt(stmt.Else, condID, nodes, edges, edgeSet, genNodeID)
			a.addLabeledEdge(condID, "No", noID, edges, edgeSet)
			return noID
		}
		return condID
	default:
		elseID := genNodeID()
		stmtStr := a.stmtToString(stmt)
		comments := a.getComments(stmt)
		if len(comments) > 0 {
			stmtStr = strings.Join(comments, "\\n") + "\\n" + stmtStr
		}
		label := a.escapeString(stmtStr)
		*nodes = append(*nodes, fmt.Sprintf("%s[\"%s\"]", elseID, label))
		a.addEdge(parentID, elseID, edges, edgeSet)
		return elseID
	}
}

// parseElseStmtWithFirstLast はelse文の最初と最後のノードIDを返すヘルパー関数
func (a *Analyzer) parseElseStmtWithFirstLast(
	elseStmt ast.Stmt,
	parentID string,
	nodes *[]string,
	edges *[]string,
	edgeSet map[string]bool,
	genNodeID func() string,
	suppressInitialEdge bool,
) (string, string) {
	switch stmt := elseStmt.(type) {
	case *ast.BlockStmt:
		return a.parseBlockStmtWithFirstLast(stmt, parentID, nodes, edges, edgeSet, genNodeID, suppressInitialEdge)
	case *ast.IfStmt:
		cond := a.exprToString(stmt.Cond)
		comments := a.getComments(stmt)
		if len(comments) > 0 {
			cond = strings.Join(comments, "\\n") + "\\n" + cond
		}
		condID := genNodeID()
		label := a.escapeString(cond)
		*nodes = append(*nodes, fmt.Sprintf("%s{{\"%s\"}}", condID, label))
		if !suppressInitialEdge {
			a.addEdge(parentID, condID, edges, edgeSet)
		}

		// if文の条件式内の関数呼び出しを検出して記録
		a.detectAndRecordFunctionCallsInExpr(stmt.Cond, condID)

		// Yes分岐の処理
		yesFirstID, _ := a.parseBlockStmtWithFirstLast(stmt.Body, condID, nodes, edges, edgeSet, genNodeID, true)
		if yesFirstID != "" {
			a.addLabeledEdge(condID, "Yes", yesFirstID, edges, edgeSet)
		}

		// No分岐の処理
		var noLastID string
		if stmt.Else != nil {
			_, noLastID = a.parseElseStmtWithFirstLast(stmt.Else, condID, nodes, edges, edgeSet, genNodeID, true)
		} else {
			noLastID = condID
		}

		// 最後のノードIDは、両方の分岐のうち実際に最後になるものを返す
		// ここでは簡単にnoLastIDを返す（実際の実装では、より複雑な判定が必要かもしれない）
		return condID, noLastID
	default:
		elseID := genNodeID()
		stmtStr := a.stmtToString(stmt)
		comments := a.getComments(stmt)
		if len(comments) > 0 {
			stmtStr = strings.Join(comments, "\\n") + "\\n" + stmtStr
		}
		label := a.escapeString(stmtStr)
		*nodes = append(*nodes, fmt.Sprintf("%s[\"%s\"]", elseID, label))
		if !suppressInitialEdge {
			a.addEdge(parentID, elseID, edges, edgeSet)
		}
		return elseID, elseID
	}
}

func (a *Analyzer) exprToString(expr ast.Expr) string {
	switch e := expr.(type) {
	case *ast.BinaryExpr:
		return a.exprToString(e.X) + " " + e.Op.String() + " " + a.exprToString(e.Y)
	case *ast.Ident:
		return e.Name
	case *ast.BasicLit:
		return e.Value
	case *ast.CallExpr:
		return a.exprToString(e.Fun) + "(" + a.argsToString(e.Args) + ")"
	case *ast.SelectorExpr:
		return a.exprToString(e.X) + "." + e.Sel.Name
	case *ast.StarExpr:
		return "*" + a.exprToString(e.X)
	case *ast.UnaryExpr:
		return e.Op.String() + a.exprToString(e.X)
	case *ast.ParenExpr:
		return "(" + a.exprToString(e.X) + ")"
	case *ast.TypeAssertExpr:
		return a.exprToString(e.X) + ".(" + a.exprToString(e.Type) + ")"
	case *ast.IndexExpr:
		return a.exprToString(e.X) + "[" + a.exprToString(e.Index) + "]"
	default:
		return ""
	}
}

func (a *Analyzer) argsToString(args []ast.Expr) string {
	var argStrs []string
	for _, arg := range args {
		argStrs = append(argStrs, a.exprToString(arg))
	}
	return strings.Join(argStrs, ", ")
}

func (a *Analyzer) stmtToString(stmt ast.Stmt) string {
	switch s := stmt.(type) {
	case *ast.AssignStmt:
		var lhs []string
		for _, expr := range s.Lhs {
			lhs = append(lhs, a.exprToString(expr))
		}
		var rhs []string
		for _, expr := range s.Rhs {
			rhs = append(rhs, a.exprToString(expr))
		}
		return fmt.Sprintf("%s %s %s", strings.Join(lhs, ", "), s.Tok.String(), strings.Join(rhs, ", "))
	case *ast.ReturnStmt:
		var results []string
		for _, expr := range s.Results {
			results = append(results, a.exprToString(expr))
		}
		return "return " + strings.Join(results, ", ")
	default:
		return ""
	}
}

// 文から関数呼び出しを検出してfunctionCallNodesに記録する
func (a *Analyzer) detectAndRecordFunctionCalls(stmt ast.Stmt, nodeID string) {
	ast.Inspect(stmt, func(n ast.Node) bool {
		if call, ok := n.(*ast.CallExpr); ok {
			if callName := a.extractCallName(call); callName != "" {
				// 関数呼び出しをfunctionCallNodesに記録
				a.functionCallNodes[nodeID] = callName
			}
		}
		return true
	})
}

// 式から関数呼び出しを検出してfunctionCallNodesに記録する
// 一番外側の関数呼び出しのみを記録する
func (a *Analyzer) detectAndRecordFunctionCallsInExpr(expr ast.Expr, nodeID string) {
	ast.Inspect(expr, func(n ast.Node) bool {
		if call, ok := n.(*ast.CallExpr); ok {
			if callName := a.extractCallName(call); callName != "" {
				// 関数呼び出しをfunctionCallNodesに記録
				a.functionCallNodes[nodeID] = callName
				// 最初の関数呼び出しを記録したら、それ以降の検索を停止
				return false
			}
		}
		return true
	})
}

func (a *Analyzer) escapeString(s string) string {
	s = strings.ReplaceAll(s, `"`, "#quot;")
	s = strings.ReplaceAll(s, "{", "\\{")
	s = strings.ReplaceAll(s, "}", "\\}")
	s = strings.ReplaceAll(s, "<", "\\<")
	s = strings.ReplaceAll(s, ">", "\\>")
	return s
}

func (a *Analyzer) addEdge(from, to string, edges *[]string, edgeSet map[string]bool) {
	edge := fmt.Sprintf("%s --> %s", from, to)
	if !edgeSet[edge] {
		*edges = append(*edges, edge)
		edgeSet[edge] = true
	}
}

func (a *Analyzer) addLabeledEdge(from, label, to string, edges *[]string, edgeSet map[string]bool) {
	edge := fmt.Sprintf("%s --> |%s| %s", from, label, to)
	if !edgeSet[edge] {
		*edges = append(*edges, edge)
		edgeSet[edge] = true
	}
}

func (a *Analyzer) formatMermaidOutput(nodes, edges []string) string {
	var buf bytes.Buffer
	buf.WriteString("flowchart TD\n")
	for _, node := range nodes {
		buf.WriteString(fmt.Sprintf("    %s\n", node))
	}
	for _, edge := range edges {
		buf.WriteString(fmt.Sprintf("    %s\n", edge))
	}

	// 関数呼び出しのクリックイベントを追加
	for nodeID, functionCall := range a.functionCallNodes {
		buf.WriteString(fmt.Sprintf("    click %s \"javascript:navigateToFunction('%s')\"\n", nodeID, functionCall))
	}

	return buf.String()
}

func (a *Analyzer) getComments(node ast.Node) []string {
	var comments []string
	if node == nil {
		return comments
	}

	pos := node.Pos()
	end := node.End()
	file := a.fileSet.File(pos)
	if file == nil {
		return comments
	}

	// 現在のノードに関連するファイルを見つける
	var astFile *ast.File
	for _, f := range a.files {
		if a.fileSet.File(f.Pos()) == file {
			astFile = f
			break
		}
	}

	if astFile == nil {
		return comments
	}

	// ノードの直前および直後のコメントを取得
	for _, cgroup := range astFile.Comments {
		if cgroup.Pos() <= pos && cgroup.End() <= end && cgroup.End()+3 >= pos {
			for _, comment := range cgroup.List {
				text := strings.TrimSpace(strings.TrimPrefix(comment.Text, "//"))
				if text != "" {
					comments = append(comments, text)
				}
			}
		}
	}
	return comments
}

func (a *Analyzer) filterFiles(files []string) []string {
	if len(a.config.ExcludePatterns) == 0 {
		return files
	}

	var filtered []string
	for _, file := range files {
		excluded := false
		for _, pattern := range a.config.ExcludePatterns {
			if matched, _ := filepath.Match(pattern, filepath.Base(file)); matched {
				excluded = true
				break
			}
		}
		if !excluded {
			filtered = append(filtered, file)
		}
	}
	return filtered
}
