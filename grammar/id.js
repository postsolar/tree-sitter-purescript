const { parens, varid_pattern, qualified } = require('./util.js')

module.exports = {
  // ------------------------------------------------------------------------
  // Identifiers
  // ------------------------------------------------------------------------

  // https://github.com/purescript/documentation/blob/09859e0d53d2b08ee7e63686a083c1a45423005f/language/Syntax.md#function-and-value-names
  // https://github.com/natefaubion/purescript-language-cst-parser/blob/bf5623e08e1f43f923d4ff3c29cafbda25128768/src/PureScript/CST/Lexer.purs#L500
  _varid: _ => varid_pattern,
  _immediate_varid: _ => token.immediate(varid_pattern),
  variable: $ => $._varid,
  _immediate_variable: $ => alias($._immediate_varid, $.variable),
  qualified_variable: $ => qualified($, $.variable),
  _qvarid: $ => choice($.qualified_variable, $.variable),

  // `_varsym` comes from the scanner.
  // operator: $ => $._varsym,
  // Scanner doesn't let us use -> <- => <= and their unicode counterparts,
  // which complicates the grammar, so just using regex here.
  // Look-around isn't allowed, so this is slightly modified.
  // https://github.com/natefaubion/purescript-language-cst-parser/blob/bf5623e08e1f43f923d4ff3c29cafbda25128768/src/PureScript/CST/Lexer.purs#L503
  _operator: _ => /(?:[:!#$%&*+./<=>?@\\^|~-]|\p{S})+/,
  operator: $ => $._operator,
  _minus: $ => alias('-', $.operator),

  // Any operator including `-`
  _operator_or_minus: $ => choice($.operator, $._minus),
  qualified_operator: $ => qualified($, $._operator_or_minus),

  // Qualified or unqualified operator, with and without `-`.
  _q_op: $ => choice($.qualified_operator, $._operator_or_minus),
  _q_op_nominus: $ => choice($.qualified_operator, $.operator),

  // Qualified and unqualified identifier or operator in parens.
  _var: $ => choice($.variable, parens($._operator_or_minus)),
  _qvar: $ => choice($._qvarid, parens($._q_op)),

  // ------------------------------------------------------------------------
  // Data constructors
  // ------------------------------------------------------------------------

  // Same as the varid pattern except this one would have to start with a capital letter.
  _conid: _ => /[\p{Lu}_][\p{L}0-9_']*/,
  constructor: $ => $._conid,

  qualified_constructor: $ => qualified($, $.constructor),
  // Qualified or unqualified data constructor.
  _qconid: $ => choice($.qualified_constructor, $.constructor),

  // Data constructor
  _con: $ => $.constructor,
  // Qualified data constructor
  _qcon: $ => $._qconid,

  // Data constructor
  _con: $ => $.constructor,
  // Qualified data constructor
  _qcon: $ => $._qconid,

  // ------------------------------------------------------------------------
  // Type constructors
  // ------------------------------------------------------------------------

  _tyconid: $ => alias($.constructor, $.type),
  qualified_type: $ => qualified($, $._tyconid),
  _qtyconid: $ => choice($.qualified_type, $._tyconid),

  // `_tyconsym` comes from the scanner.
  _type_operator: $ => alias($._tyconsym, $.type_operator),
  qualified_type_operator: $ => qualified($, alias($._tyconsym, $.type_operator)),

  _qualified_type_operator: $ => $.qualified_type_operator,
  _qtyconsym: $ => choice($._qualified_type_operator, $._type_operator),

  _simple_tycon: $ => choice($._tyconid, parens($._type_operator)),
  _simple_qtyconop: $ => choice($._qtyconid, parens($._qtyconsym)),

  // TODO: Should be removed?
  // Technically it is a 'special' value, but:
  // 1. Doesn't matter semantically for the grammar
  // 2. All other type operators behave exactly the same way
  tycon_arrow: $ => parens($._arrow),

  type_literal: $ => choice(
    $.integer,
    $.string,
    $.triple_quote_string
  ),

  _qtycon: $ => choice($._qtyconid, parens($._qtyconsym)),

  _gtycon: $ => choice(
    $._qtycon,
    $.tycon_arrow,
  ),

  literal: $ => $._literal,
  _name: $ => choice($._var, $._con),
  _qname: $ => choice($._qvar, $._qcon),
}
