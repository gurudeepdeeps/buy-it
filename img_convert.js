const fs = require('fs');

function processFile(file, isProductImg) {
    let content = fs.readFileSync(file, 'utf8');
    let newContent = content.replace(/<img([^>]+)>/g, (match, attrs) => {
        if (!isProductImg(attrs)) return match;
        if (attrs.includes('onclick=')) return match;

        attrs = attrs.replace(/class="([^"]+)"/, 'class="$1 cursor-pointer"');

        return `<img${attrs}>`;
    });

    if (content !== newContent) {
        fs.writeFileSync(file, newContent, 'utf8');
        console.log(`Updated ${file}`);
    }
}

processFile('C:\\Users\\gurud\\Downloads\\Hub\\index.html',
    attrs => attrs.includes('group-hover:scale-110')
);

processFile('C:\\Users\\gurud\\Downloads\\Hub\\products.html',
    attrs => attrs.includes('object-contain') && attrs.includes('group-hover:scale-105')
);
