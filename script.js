// ==UserScript==
// @name Inline Math for Notion.so
// @homepageURL https://www.notion.so/evertheylen/Notion-Inline-Math-9c5047a4e7c84643848b3630db8d5a5e
// @version 0.2.1
// @match https://www.notion.so/*
// @grant GM_addStyle
// @require https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.js
// ==/UserScript==

// Instructions for use:
//   - Use inline code starting with "math:". For example: `math: f(x) = x^2`
//   - Press F2 to rerender all inline math. You can of course change the shortcut in the code below.
//   - The inline math will revert to inline code when the block becomes active.

GM_addStyle(`
.notion-frame span .katex {
    padding-right: 0 !important;
}
`)

function render_one(el) {
    var s = el.textContent
    el.style.color = null
    el.style.background = null
    s = s.slice(5).trim()
    console.log("rendering ", s)
    katex.render(s, el, {throwOnError: false})
}

function rerender_all() {
    console.log("rerender all!")
    var mathElement = Array.from(document.querySelectorAll("span[style*=\"monospace\"]"))
    var filtered = mathElement.filter(el => el.textContent.startsWith("math:"))
    filtered.forEach(function(el) {
        render_one(el)
    })
}

function loadKatexStyleSheet() {
    console.log('Loading KateX stylesheet')
    var myCSS = document.createElement( "link" );
    myCSS.rel = "stylesheet";
    myCSS.href = "https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css";
    // insert it at the end of the head in a legacy-friendly manner
    document.head.insertBefore( myCSS, document.head.childNodes[ document.head.childNodes.length - 1 ].nextSibling );
}

function pollForMathContents(maxPolls = 20, interval = 200) {
    var counter = maxPolls;
    var checkExist = setInterval(function() {
        var content = document.querySelectorAll("div.notion-page-content")
        var contentExists = typeof(content) != 'undefined' && content != null

        if (contentExists && content.length > 0) {
            var math = content[0].querySelectorAll("span[style*=\"monospace\"]")

            if (math.length > 0 || counter == 0) {
                console.log("Math content found or poll limit reached");
                clearInterval(checkExist);
                rerender_all()
            }
        }
        counter--
    }, interval);
}

document.onreadystatechange = function() {
    if (document.readyState === 'complete') {
        loadKatexStyleSheet();
        pollForMathContents(20, 200);
    }
};

window.addEventListener('keydown', function(e) {
    if (e.key == "F2" && !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey) {
        rerender_all()
    }
}, true)
