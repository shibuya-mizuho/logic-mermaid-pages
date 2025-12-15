package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
)

func main() {
	config := &Config{
		TargetFiles: []string{
			"application/usecase/main.go",
			"application/service/*.go",
			"application/validator/*.go",
			"interface/schema/*.go",
		},
		ExcludePatterns: []string{
			"*_test.go",
		},
		OutputDir: "docs/logic",
		Verbose:   true,
	}

	fmt.Println("Mermaidドキュメント生成を開始します...")

	// 解析実行
	analyzer := NewAnalyzer(config)
	functions, err := analyzer.AnalyzeAllTargetFiles()
	if err != nil {
		log.Fatalf("解析エラー: %v", err)
	}

	fmt.Printf("解析完了: %d個の関数を検出しました\n", len(functions))

	// HTML生成
	generator := NewHTMLGenerator(config)
	err = generator.GenerateDocumentation(functions)
	if err != nil {
		log.Fatalf("生成エラー: %v", err)
	}

	fmt.Printf("Mermaidドキュメントを生成しました: %s\n", config.OutputDir)
}

type Config struct {
	TargetFiles     []string
	ExcludePatterns []string
	OutputDir       string
	Verbose         bool
}

func expandGlob(patterns []string) ([]string, error) {
	var files []string
	for _, pattern := range patterns {
		matches, err := filepath.Glob(pattern)
		if err != nil {
			return nil, err
		}
		files = append(files, matches...)
	}
	return files, nil
}

func ensureDir(dir string) error {
	return os.MkdirAll(dir, 0755)
}
