package main

import (
	"bytes"
	"embed"
	"encoding/json"
	"fmt"
	"html/template"
	"os"
	"path/filepath"
	textTemplate "text/template"
	"time"
)

//go:embed templates/*
var templateFS embed.FS

type HTMLGenerator struct {
	config        *Config
	htmlTemplates *template.Template
	jsTemplates   *textTemplate.Template
}

// getGeneratedAt は現在時刻を日本語形式で返す
func (g *HTMLGenerator) getGeneratedAt() string {
	jst, _ := time.LoadLocation("Asia/Tokyo")
	now := time.Now().In(jst)
	return now.Format("2006年1月2日 15:04 (JST)")
}

func NewHTMLGenerator(config *Config) *HTMLGenerator {
	// HTML用テンプレート（HTMLエスケープあり）
	htmlTemplates := template.Must(template.ParseFS(templateFS, "templates/html/*.tmpl"))

	// JavaScript用テンプレート（HTMLエスケープなし）
	jsTemplates := textTemplate.Must(textTemplate.ParseFS(templateFS, "templates/js/*.tmpl"))

	return &HTMLGenerator{
		config:        config,
		htmlTemplates: htmlTemplates,
		jsTemplates:   jsTemplates,
	}
}

func (g *HTMLGenerator) GenerateDocumentation(functions map[string]*FunctionInfo) error {
	// 出力ディレクトリ作成
	if err := ensureDir(g.config.OutputDir); err != nil {
		return err
	}
	if err := ensureDir(filepath.Join(g.config.OutputDir, "assets")); err != nil {
		return err
	}

	// メインHTMLファイル生成
	if err := g.generateMainHTML(functions); err != nil {
		return err
	}

	// JavaScript関数データ生成
	if err := g.generateFunctionsJS(functions); err != nil {
		return err
	}

	// ナビゲーションJS生成
	if err := g.generateNavigatorJS(); err != nil {
		return err
	}

	// Mermaid初期化JS生成
	if err := g.generateMermaidInitJS(); err != nil {
		return err
	}

	// CSS生成
	if err := g.generateCSS(); err != nil {
		return err
	}

	return nil
}

func (g *HTMLGenerator) generateMainHTML(functions map[string]*FunctionInfo) error {
	data := struct {
		FunctionCount int
		GeneratedAt   string
		Version       string
	}{
		FunctionCount: len(functions),
		GeneratedAt:   g.getGeneratedAt(),
		Version:       time.Now().Format("200601021504"),
	}

	file, err := os.Create(filepath.Join(g.config.OutputDir, "index.html"))
	if err != nil {
		return err
	}
	defer file.Close()

	return g.htmlTemplates.ExecuteTemplate(file, "index.html.tmpl", data)
}

func (g *HTMLGenerator) generateFunctionsJS(functions map[string]*FunctionInfo) error {
	// 関数データをJSONに変換
	functionsData := make(map[string]interface{})
	for name, info := range functions {
		functionsData[name] = map[string]interface{}{
			"packageName":     info.PackageName,
			"fileName":        info.FileName,
			"functionName":    info.FunctionName,
			"fullName":        info.FullName,
			"receiverType":    info.ReceiverType,
			"mermaidCode":     info.MermaidCode,
			"calledFunctions": info.CalledFunctions,
			"comments":        info.Comments,
		}
	}

	jsonData, err := json.MarshalIndent(functionsData, "", "  ")
	if err != nil {
		return err
	}

	jsContent := fmt.Sprintf("const functionsData = %s;", string(jsonData))

	file, err := os.Create(filepath.Join(g.config.OutputDir, "assets", "functions.js"))
	if err != nil {
		return err
	}
	defer file.Close()

	_, err = file.WriteString(jsContent)
	return err
}

func (g *HTMLGenerator) generateNavigatorJS() error {
	file, err := os.Create(filepath.Join(g.config.OutputDir, "assets", "navigator.js"))
	if err != nil {
		return err
	}
	defer file.Close()

	// text/templateを使用してHTMLエスケープを防ぐ
	var buf bytes.Buffer
	if err := g.jsTemplates.ExecuteTemplate(&buf, "navigator.js.tmpl", nil); err != nil {
		return err
	}

	_, err = file.Write(buf.Bytes())
	return err
}

func (g *HTMLGenerator) generateMermaidInitJS() error {
	file, err := os.Create(filepath.Join(g.config.OutputDir, "assets", "mermaid-init.js"))
	if err != nil {
		return err
	}
	defer file.Close()

	// text/templateを使用してHTMLエスケープを防ぐ
	var buf bytes.Buffer
	if err := g.jsTemplates.ExecuteTemplate(&buf, "mermaid-init.js.tmpl", nil); err != nil {
		return err
	}

	_, err = file.Write(buf.Bytes())
	return err
}

func (g *HTMLGenerator) generateCSS() error {
	file, err := os.Create(filepath.Join(g.config.OutputDir, "assets", "styles.css"))
	if err != nil {
		return err
	}
	defer file.Close()

	return g.htmlTemplates.ExecuteTemplate(file, "styles.css.tmpl", nil)
}
