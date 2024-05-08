/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, forceUpdate, h } from "@stencil/core";
import { createColorClasses, hostContext } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot - Content is placed between the named slots if provided without a slot.
 * @slot start - Content is placed to the left of the toolbar text in LTR, and to the right in RTL.
 * @slot secondary - Content is placed to the left of the toolbar text in `ios` mode, and directly to the right in `md` mode.
 * @slot primary - Content is placed to the right of the toolbar text in `ios` mode, and to the far right in `md` mode.
 * @slot end - Content is placed to the right of the toolbar text in LTR, and to the left in RTL.
 */
export class Toolbar {
    constructor() {
        this.childrenStyles = new Map();
        this.color = undefined;
    }
    componentWillLoad() {
        const buttons = Array.from(this.el.querySelectorAll('ion-buttons'));
        const firstButtons = buttons.find((button) => {
            return button.slot === 'start';
        });
        if (firstButtons) {
            firstButtons.classList.add('buttons-first-slot');
        }
        const buttonsReversed = buttons.reverse();
        const lastButtons = buttonsReversed.find((button) => button.slot === 'end') ||
            buttonsReversed.find((button) => button.slot === 'primary') ||
            buttonsReversed.find((button) => button.slot === 'secondary');
        if (lastButtons) {
            lastButtons.classList.add('buttons-last-slot');
        }
    }
    childrenStyle(ev) {
        ev.stopPropagation();
        const tagName = ev.target.tagName;
        const updatedStyles = ev.detail;
        const newStyles = {};
        const childStyles = this.childrenStyles.get(tagName) || {};
        let hasStyleChange = false;
        Object.keys(updatedStyles).forEach((key) => {
            const childKey = `toolbar-${key}`;
            const newValue = updatedStyles[key];
            if (newValue !== childStyles[childKey]) {
                hasStyleChange = true;
            }
            if (newValue) {
                newStyles[childKey] = true;
            }
        });
        if (hasStyleChange) {
            this.childrenStyles.set(tagName, newStyles);
            forceUpdate(this);
        }
    }
    render() {
        const mode = getIonMode(this);
        const childStyles = {};
        this.childrenStyles.forEach((value) => {
            Object.assign(childStyles, value);
        });
        return (h(Host, { key: 'af016bf9981a2d6182783c6643e2d460245ecc2f', class: Object.assign(Object.assign({}, childStyles), createColorClasses(this.color, {
                [mode]: true,
                'in-toolbar': hostContext('ion-toolbar', this.el),
            })) }, h("div", { key: '437debb5b7c561b315d887ae8d47186cba5521ce', class: "toolbar-background" }), h("div", { key: '4c2429fa3e8526fedf456e4658be92d5dce8ca34', class: "toolbar-container" }, h("slot", { key: '4c07db12cfc48b4836b566449b854c24db308e3a', name: "start" }), h("slot", { key: '12855ec04622c09cc404f9b4f07f57a73e5770a0', name: "secondary" }), h("div", { key: '56f37d52c91de2b76910defbc9e5b7c1def3861c', class: "toolbar-content" }, h("slot", { key: 'c10ec3fdbea10a6388f4f510d45188f7fda1a371' })), h("slot", { key: 'c8ed49c6888faf35e71f2a8f4f6bf98fb0c34a25', name: "primary" }), h("slot", { key: '0251f3980082a092304f95cbc002bc8c633c5739', name: "end" }))));
    }
    static get is() { return "ion-toolbar"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "ios": ["toolbar.ios.scss"],
            "md": ["toolbar.md.scss"]
        };
    }
    static get styleUrls() {
        return {
            "ios": ["toolbar.ios.css"],
            "md": ["toolbar.md.css"]
        };
    }
    static get properties() {
        return {
            "color": {
                "type": "string",
                "mutable": false,
                "complexType": {
                    "original": "Color",
                    "resolved": "\"danger\" | \"dark\" | \"light\" | \"medium\" | \"primary\" | \"secondary\" | \"success\" | \"tertiary\" | \"warning\" | string & Record<never, never> | undefined",
                    "references": {
                        "Color": {
                            "location": "import",
                            "path": "../../interface",
                            "id": "src/interface.d.ts::Color"
                        }
                    }
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The color to use from your application's color palette.\nDefault options are: `\"primary\"`, `\"secondary\"`, `\"tertiary\"`, `\"success\"`, `\"warning\"`, `\"danger\"`, `\"light\"`, `\"medium\"`, and `\"dark\"`.\nFor more information on colors, see [theming](/docs/theming/basics)."
                },
                "attribute": "color",
                "reflect": true
            }
        };
    }
    static get elementRef() { return "el"; }
    static get listeners() {
        return [{
                "name": "ionStyle",
                "method": "childrenStyle",
                "target": undefined,
                "capture": false,
                "passive": false
            }];
    }
}
