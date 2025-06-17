package tree_sitter_purescript_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_purescript "github.com/postsolar/tree-sitter-purescript/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_purescript.Language())
	if language == nil {
		t.Errorf("Error loading PureScript grammar")
	}
}
