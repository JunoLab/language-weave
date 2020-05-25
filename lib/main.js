'use babel'
import { CompositeDisposable } from 'atom'
import path from 'path'

let subs = null
let toolbar = null
let juliaClient = null
let HTMLPreviewView = require('./html-preview.js')

export function activate () {
    subs = new CompositeDisposable()

    subs.add(atom.workspace.addOpener((uri) => {
        if (path.extname(uri) === '.html' && uri.startsWith('preview://')) {
            return new HTMLPreviewView(uri)
        }
    }))

    subs.add(atom.commands.add(
        `atom-text-editor[data-grammar="source julia"],
         atom-text-editor[data-grammar="source weave md"],
         atom-text-editor[data-grammar="source weave latex"]`,
        'weave:weave-to-pdf', () => weave('pdf')
    ))
    subs.add(atom.commands.add(
        `atom-text-editor[data-grammar="source julia"],
         atom-text-editor[data-grammar="source weave md"],
         atom-text-editor[data-grammar="source weave latex"]`,
        'weave:weave-to-html', () => weave('html')
    ))
}

function weave(format) {
    if (juliaClient === null) {
        atom.notifications.addError("Juno not installed", {
            description: "[Juno](http://junolab.org/) needs to be installed to weave files."
        })
        return
    }

    juliaClient.boot()

    const ed = atom.workspace.getActiveTextEditor()
    const pane = atom.workspace.getActivePane()
    if (!ed) {
        atom.notifications.addError("No editor selected", {
            description: "Select an editor to weave a file."
        })
        return
    }
    let edpath = ed.getPath()
    if (!edpath) {
        atom.notifications.addError("File is not saved", {
            description: "Please save your file to weave it."
        })
        return
    }

    ed.save()

    if (process.platform === 'win32') {
        edpath = edpath.replace(/\\/g, "/")
    }
    let outpath = edpath.split('.')
    outpath.pop()
    outpath = outpath.join('.') + '.' + format
    let doctype = 'md2' + format

    let weaveCommand  = 'using Weave;'
    weaveCommand += 'try;'
    weaveCommand += `weave("${edpath}", doctype="${doctype}"); 1;`
    weaveCommand += 'catch err;'
    weaveCommand += '@error("Weaving failed.", error=err); 0;'
    weaveCommand += 'end'

    let outPathCommand = 'using Weave: separate_header_text, parse_header, specific_options!;'
    outPathCommand += `headertext, = separate_header_text(read("${edpath}", String));`
    outPathCommand += 'header = parse_header(headertext);'
    outPathCommand += 'weave_options = get(header, "weave_options", Dict());'
    outPathCommand += `format_options = specific_options!(weave_options, "${doctype}");`
    outPathCommand += 'actual_options = isnothing(format_options) ? weave_options : format_options;'
    outPathCommand += 'get(actual_options, "out_path", "")'

    const evalsimple = juliaClient.import({rpc: ['evalsimple']}).evalsimple
    evalsimple(weaveCommand).then((res) => {
        if (!atom.config.get('language-weave.showPreview')) return

        if (res == 1) {
            evalsimple(outPathCommand).then((outputFolder) => {
                if (outputFolder !== '') {
                    outpath = outpath.split('/')
                    outpath.splice(outpath.length-1, 0, outputFolder)
                    outpath = outpath.join('/')
                }

                if (format == 'html') {
                    outpath = 'preview://' + outpath
                }
                if (
                    format === 'pdf' && (
                        !atom.packages.isPackageActive('pdf-view') &&
                        !atom.packages.isPackageActive('pdf-view-plus')
                    )
                ) {
                    atom.notifications.addError("Can't display PDF", {
                        description: 'Please install the [pdf-view-plus](https://github.com/Aerijo/atom-pdf-view-plus) package.'
                    })
                    return
                }
                atom.workspace.open(outpath, {
                    searchAllPanes: true,
                    split: 'right'
                }).then(() => {
                    pane.activate()
                    pane.activateItem(ed)
                })
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
    if (!atom.config.get('julia-client.uiOptions.enableToolBar')) return
    toolbar = getToolBar()
    toolbar.addSpacer()
    toolbar.addButton({
        icon: 'logo-html5',
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

export var config = {
    showPreview: {
        type: 'boolean',
        default: true,
        title: 'Show Previews'
    }
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
