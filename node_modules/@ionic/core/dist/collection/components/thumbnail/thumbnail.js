/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { getIonMode } from "../../global/ionic-global";
export class Thumbnail {
    render() {
        return (h(Host, { key: '29ed7678be93e55afad58bd37a61db3a289a5d76', class: getIonMode(this) }, h("slot", { key: 'da1eb174d2544b9d452c98076f6e0abcda60099d' })));
    }
    static get is() { return "ion-thumbnail"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["thumbnail.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["thumbnail.css"]
        };
    }
}
