'use babel'
import { CompositeDisposable } from 'atom'

var subs

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
}

export function deactivate () {
    subs.dispose()
}
