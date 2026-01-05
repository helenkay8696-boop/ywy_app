
import re

with open('/Users/helen/Desktop/Antigravity/丰源项目/货主APP成长版/js/app.js', 'r') as f:
    content = f.read()

# Fix common tag corruptions
content = content.replace('< div', '<div')
content = content.replace('</div >', '</div>')
content = content.replace('< header', '<header')
content = content.replace('</header >', '</header>')
content = content.replace('< !--', '<!--')
content = content.replace('-- >', '-->')
content = content.replace('style = "', 'style="')
content = content.replace('} }', '}}')

# Fix the specific corrupted blocks I noticed
content = content.replace('</div >\n            `;\n        }', '</div>\n        `;\n    }')

# Write back
with open('/Users/helen/Desktop/Antigravity/丰源项目/货主APP成长版/js/app.js', 'w') as f:
    f.write(content)
