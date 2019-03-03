'use babel'
import { CompositeDisposable } from 'atom'
import path from 'path'

let subs = null
let toolbar = null
let juliaClient = null
let HTMLPreviewView = require('./html-preview.js')

export function activate () {
    subs = new CompositeDisposable()
    // Dispatch to the relevant language-markdown commands if that package is
    // active. Let Atom handle the events otherwise.
    for (let cmd of ['indent-list-item',
                     'outdent-list-item',
                     'emphasis',
                     'strong-emphasis',
                     'strike-through',
                     'link',
                     'image',
                     'toggle-task']) {
    subs.add(atom.commands.add('atom-text-editor',
        'weave:'+cmd, (event) => {
            if (atom.packages.isPackageActive("language-markdown")) {
                atom.commands.dispatch(event.target, "markdown:"+cmd)
            } else {
                event.abortKeyBinding()
            }
        }))
    }

    subs.add(atom.workspace.addOpener((uri) => {
        console.log(uri);
        if (path.extname(uri) === '.html' && uri.startsWith('preview://')) {
            return new HTMLPreviewView(uri)
        }
    }))

    subs.add(atom.commands.add('atom-text-editor',
        'weave:weave-to-pdf', () => weave('pdf')))
    subs.add(atom.commands.add('atom-text-editor',
        'weave:weave-to-html', () => weave('html')))
}

function weave(format) {
    if (juliaClient === null) {
        atom.notifications.addError("Juno not installed", {
            description: "[Juno](http://junolab.org/) needs to be installed to weave files."
        })
        return
    }

    if (format === 'pdf' && atom.packages.isPackageActive('pdf-view')) {
        atom.notifications.addError("Can't display PDF", {
            description: 'Please install the [pdf-view](https://github.com/izuzak/atom-pdf-view) package.'
        })
        return
    }

    juliaClient.boot()

    ed = atom.workspace.getActiveTextEditor()
    pane = atom.workspace.getActivePane()
    if (!ed) {
        atom.notifications.addError("No editor selected", {
            description: "Select an editor to weave a file."
        })
        return
    }
    edpath = ed.getPath()
    if (!edpath) {
        atom.notifications.addError("File is not saved", {
            description: "Please save your file to weave it."
        })
        return
    }
    outpath = edpath.split('.')
    outpath.pop()
    outpath = outpath.join('.') + '.' + format

    weaveCommand  = 'using Weave;'
    weaveCommand += 'try;'
    weaveCommand += `weave("${edpath}", doctype="md2${format}"); 1;`
    weaveCommand += 'catch err;'
    weaveCommand += '@error("Weaving failed.", error=err); 0;'
    weaveCommand += 'end'

    evalsimple = juliaClient.import({rpc: ['evalsimple']}).evalsimple
    evalsimple(weaveCommand).then((res) => {
        if (res == 1) {
            if (format == 'html') {
                outpath = 'preview://' + outpath
            }
            atom.workspace.open(outpath, {
                searchAllPanes: true,
                split: 'right'
            }).then(() => {
                pane.activate()
                pane.activateItem(ed)
            })
        } else {
            atom.notifications.addError("Weaving file failed", {
                description: "See the REPL for details."
            })
        }
    })
}

export function consumeJuliaClient (client) {
    juliaClient = client
}

export function consumeToolBar (getToolBar) {
    toolbar = getToolBar()
    toolbar.addSpacer()
    toolbar.addButton({
        icon: 'social-html5',
        iconset: 'ion',
        callback: 'weave:weave-to-html',
        tooltip: 'Weave HTML'
    })
    toolbar.addButton({
        icon: 'file-pdf',
        iconset: 'fa',
        callback: 'weave:weave-to-pdf',
        tooltip: 'Weave PDF'
    })
    toolbar.addSpacer()
}

export function deactivate () {
    if (toolbar) {
        toolbar.removeItems()
        toolbar = null
    }
    subs.dispose()
}

export function deserialize({filePath, uri}) {
    if (require('fs-plus').isFileSync(filePath)) {
        return new HTMLPreviewView(uri)
    }
}
