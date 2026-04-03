const { sep1 } = require('./util.js')

module.exports = {
// possible types of deriving declarations:
// derive instance Eq (Id a)
// derive instance Eq a => Eq (Id a)
// derive instance (Eq a, Eq a) => Eq (Id a)
// derive instance eqId :: Eq (Id a)
// derive instance eqId :: Eq a => Eq (Id a)
// derive instance eqId :: (Eq a, Eq a) => Eq (Id a)
// derive newtype instance Eq (Id a)
// derive newtype instance Eq a => Eq (Id a)
// derive newtype instance (Eq a, Eq a) => Eq (Id a)
// derive newtype instance eqId :: Eq (Id a)
// derive newtype instance eqId :: Eq a => Eq (Id a)
// derive newtype instance eqId :: (Eq a, Eq a) => Eq (Id a)

  decl_derive: $ => prec(1, seq(
    'derive',
    optional('newtype'),
    'instance',
    optional(seq(alias($._varid, $.instance_name), $._colon2)),
    optional(seq($.constraints, $._rcarrow)),
    $.type_name,
    repeat($._atype)
  )),

// Attached derive clauses on data/newtype declarations:
// derive (Eq, Ord, Show)
// derive newtype (Eq, Ord)
// derive (ReadForeign, WriteForeign) via Int
// derive (Functor F) via SomeType

  derive_clause: $ => seq(
    'derive',
    optional('newtype'),
    '(',
    sep1($.comma, $.derive_class_head),
    ')',
    optional(seq('via', $._atype)),
  ),

  derive_class_head: $ => seq(
    $.class_name,
    repeat($._atype),
  ),

}
