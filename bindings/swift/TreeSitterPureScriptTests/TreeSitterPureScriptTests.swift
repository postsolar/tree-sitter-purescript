import XCTest
import SwiftTreeSitter
import TreeSitterPurescript

final class TreeSitterPurescriptTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_purescript())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading PureScript grammar")
    }
}
