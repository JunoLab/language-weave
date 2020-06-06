import ScrollView from 'atom-space-pen-views-plus/src/scroll-view'
import fs from 'fs-plus'
import path from 'path'

export default class HTMLPreview extends ScrollView {
    static content () {
        return this.div({class: 'html-view', tabindex: -1}, () => {
            this.div({outlet: 'container', style: 'width:100%;height:100%;background-color:white'})
        })
    }

    constructor (uri) {
        super()
        this.uri = uri
        this.filePath = uri.split('://')[1]
        this.isAttached = false
        this.id = Math.round(Math.random()*10**10)

        this.showDocument()
        this.watcher = this.keepUpdated()
    }

    showDocument () {
        this.webview = document.createElement('webview')
        this.webview.id = this.id
        this.webview.setAttribute('src', this.filePath)
        this.webview.setAttribute('style', 'width: 100%; height: 100%')
        this.container[0].appendChild(this.webview)
        this.isAttached = true
    }

    keepUpdated () {
        if (fs.existsSync(this.filePath)) {
            let watcher = fs.watch(this.filePath, {}, (eventType, filename) => {
                if (eventType === 'change') {
                    this.reloadWebview()
                } else {
                    watcher.close()
                }
            })
            return watcher
        }
    }

    reloadWebview () {
        if (this.webview && this.isAttached && document.getElementById(`${this.id}`)) {
            this.webview.reloadIgnoringCache()
        }
    }

    serialize () {
        return {
            uri: this.uri,
            filePath: this.filePath,
            deserializer: 'HTMLPreviewDeserializer'
        }
    }

    getTitle() {
        if (this.filePath) {
            return 'Preview: ' + path.basename(this.filePath)
        } else {
            return 'untitled'
        }
    }

    getURI() {
        return this.uri
    }

    getPath() {
        return this.filePath
    }

    destroy() {
        if (this.watcher) {
            this.watcher.close()
        }
        return this.detach()
    }
}
