import re
import glob

def shift_x_in_text(text, offset):
    # Shift any x="val" or cx="val" by offset, unless it's x="0", x="0.5", x="1" (backgrounds)
    def repl(m):
        attr = m.group(1)
        val = float(m.group(2))
        if val > 5:  # Ignore background rects and viewBox
            # Keep precision if float
            new_val = val + offset
            if new_val.is_integer():
                return f'{attr}="{int(new_val)}"'
            return f'{attr}="{new_val}"'
        return m.group(0)
    
    return re.sub(r'\b([c]?x)="([0-9.]+)"', repl, text)

# 1. Headings (shift right by 28, reduce line width)
for fpath in glob.glob('assets/heading-*.svg'):
    with open(fpath, 'r') as f: content = f.read()
    
    # shift x and cx by +28
    content = shift_x_in_text(content, 28)
    
    # fix line: x="0" -> x="28", width="880" -> width="824"
    content = content.replace('x="0" y="32" width="880"', 'x="28" y="32" width="824"')
    
    # fix paths (e.g. M7, cx=11, etc. - wait, path commands need manual parsing)
    # Actually, easier to wrap the icon and text in a group! <g transform="translate(28, 0)">
    # But wait, we already shifted x attributes. What about path d="..."?
    # Better: just use a group for the heading content and line separately?
    pass

