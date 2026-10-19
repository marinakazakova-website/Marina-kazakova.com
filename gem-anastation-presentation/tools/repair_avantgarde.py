"""Make the supplied AvantGarde.ttf (Tilde, 1992) loadable in browsers.

Chrome's font sanitizer rejects the original: its table directory and cmap
headers are malformed. This rewrites only the character map (one clean
Windows-Unicode subtable) and maps U+00A0 no-break space to the existing space
glyph. Outlines, metrics and kerning are untouched.

Usage: python3 tools/repair_avantgarde.py
  fonts/licensed/AvantGarde.ttf -> fonts/licensed/AvantGarde-web.ttf
"""
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.ttLib.tables._c_m_a_p import cmap_format_4

root = Path(__file__).resolve().parent.parent / "fonts" / "licensed"
font = TTFont(root / "AvantGarde.ttf")
cmap = dict(font.getBestCmap())
cmap.setdefault(0xA0, cmap[0x20])
table = cmap_format_4(4)
table.platformID, table.platEncID, table.language, table.cmap = 3, 1, 0, cmap
font["cmap"].tables = [table]
font.save(root / "AvantGarde-web.ttf")
