/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */
import { Host, h } from "@stencil/core";
import { doc } from "../../utils/browser/index";
import { getElementRoot, raf } from "../../utils/helpers";
import { hapticSelectionChanged, hapticSelectionEnd, hapticSelectionStart } from "../../utils/native/haptic";
import { isPlatform } from "../../utils/platform";
import { createColorClasses } from "../../utils/theme";
import { getIonMode } from "../../global/ionic-global";
/**
 * @virtualProp {"ios" | "md"} mode - The mode determines which platform styles to use.
 *
 * @slot prefix - Content to show on the left side of the picker options.
 * @slot suffix - Content to show on the right side of the picker options.
 */
export class PickerColumn {
    constructor() {
        this.isScrolling = false;
        this.isColumnVisible = false;
        this.canExitInputMode = true;
        this.centerPickerItemInView = (target, smooth = true, canExitInputMode = true) => {
            const { isColumnVisible, scrollEl } = this;
            if (isColumnVisible && scrollEl) {
                // (Vertical offset from parent) - (three empty picker rows) + (half the height of the target to ensure the scroll triggers)
                const top = target.offsetTop - 3 * target.clientHeight + target.clientHeight / 2;
                if (scrollEl.scrollTop !== top) {
                    /**
                     * Setting this flag prevents input
                     * mode from exiting in the picker column's
                     * scroll callback. This is useful when the user manually
                     * taps an item or types on the keyboard as both
                     * of these can cause a scroll to occur.
                     */
                    this.canExitInputMode = canExitInputMode;
                    scrollEl.scroll({
                        top,
                        left: 0,
                        behavior: smooth ? 'smooth' : undefined,
                    });
                }
            }
        };
        this.setPickerItemActiveState = (item, isActive) => {
            if (isActive) {
                item.classList.add(PICKER_ITEM_ACTIVE_CLASS);
            }
            else {
                item.classList.remove(PICKER_ITEM_ACTIVE_CLASS);
            }
        };
        /**
         * When ionInputModeChange is emitted, each column
         * needs to check if it is the one being made available
         * for text entry.
         */
        this.inputModeChange = (ev) => {
            if (!this.numericInput) {
                return;
            }
            const { useInputMode, inputModeColumn } = ev.detail;
            /**
             * If inputModeColumn is undefined then this means
             * all numericInput columns are being selected.
             */
            const isColumnActive = inputModeColumn === undefined || inputModeColumn === this.el;
            if (!useInputMode || !isColumnActive) {
                this.setInputModeActive(false);
                return;
            }
            this.setInputModeActive(true);
        };
        /**
         * Setting isActive will cause a re-render.
         * As a result, we do not want to cause the
         * re-render mid scroll as this will cause
         * the picker column to jump back to
         * whatever value was selected at the
         * start of the scroll interaction.
         */
        this.setInputModeActive = (state) => {
            if (this.isScrolling) {
                this.scrollEndCallback = () => {
                    this.isActive = state;
                };
                return;
            }
            this.isActive = state;
        };
        /**
         * When the column scrolls, the component
         * needs to determine which item is centered
         * in the view and will emit an ionChange with
         * the item object.
         */
        this.initializeScrollListener = () => {
            /**
             * The haptics for the wheel picker are
             * an iOS-only feature. As a result, they should
             * be disabled on Android.
             */
            const enableHaptics = isPlatform('ios');
            const { el, scrollEl } = this;
            let timeout;
            let activeEl = this.activeItem;
            const scrollCallback = () => {
                raf(() => {
                    if (!scrollEl)
                        return;
                    if (timeout) {
                        clearTimeout(timeout);
                        timeout = undefined;
                    }
                    if (!this.isScrolling) {
                        enableHaptics && hapticSelectionStart();
                        this.isScrolling = true;
                    }
                    /**
                     * Select item in the center of the column
                     * which is the month/year that we want to select
                     */
                    const bbox = scrollEl.getBoundingClientRect();
                    const centerX = bbox.x + bbox.width / 2;
                    const centerY = bbox.y + bbox.height / 2;
                    /**
                     * elementFromPoint returns the top-most element.
                     * This means that if an ion-backdrop is overlaying the
                     * picker then the appropriate picker column option will
                     * not be selected. To account for this, we use elementsFromPoint
                     * and use an Array.find to find the appropriate column option
                     * at that point.
                     *
                     * Additionally, the picker column could be used in the
                     * Shadow DOM (i.e. in ion-datetime) so we need to make
                     * sure we are choosing the correct host otherwise
                     * the elements returns by elementsFromPoint will be
                     * retargeted. To account for this, we check to see
                     * if the picker column has a parent shadow root. If
                     * so, we use that shadow root when doing elementsFromPoint.
                     * Otherwise, we just use the document.
                     */
                    const rootNode = el.getRootNode();
                    const hasParentShadow = rootNode instanceof ShadowRoot;
                    const referenceNode = hasParentShadow ? rootNode : doc;
                    /**
                     * If the reference node is undefined
                     * then it's likely that doc is undefined
                     * due to being in an SSR environment.
                     */
                    if (referenceNode === undefined) {
                        return;
                    }
                    const elementsAtPoint = referenceNode.elementsFromPoint(centerX, centerY);
                    /**
                     * elementsFromPoint can returns multiple elements
                     * so find the relevant picker column option if one exists.
                     */
                    const newActiveElement = elementsAtPoint.find((el) => el.tagName === 'ION-PICKER-COLUMN-OPTION');
                    if (activeEl !== undefined) {
                        this.setPickerItemActiveState(activeEl, false);
                    }
                    if (newActiveElement === undefined || newActiveElement.disabled) {
                        return;
                    }
                    /**
                     * If we are selecting a new value,
                     * we need to run haptics again.
                     */
                    if (newActiveElement !== activeEl) {
                        enableHaptics && hapticSelectionChanged();
                        if (this.canExitInputMode) {
                            /**
                             * The native iOS wheel picker
                             * only dismisses the keyboard
                             * once the selected item has changed
                             * as a result of a swipe
                             * from the user. If `canExitInputMode` is
                             * `false` then this means that the
                             * scroll is happening as a result of
                             * the `value` property programmatically changing
                             * either by an application or by the user via the keyboard.
                             */
                            this.exitInputMode();
                        }
                    }
                    activeEl = newActiveElement;
                    this.setPickerItemActiveState(newActiveElement, true);
                    timeout = setTimeout(() => {
                        this.isScrolling = false;
                        enableHaptics && hapticSelectionEnd();
                        /**
                         * Certain tasks (such as those that
                         * cause re-renders) should only be done
                         * once scrolling has finished, otherwise
                         * flickering may occur.
                         */
                        const { scrollEndCallback } = this;
                        if (scrollEndCallback) {
                            scrollEndCallback();
                            this.scrollEndCallback = undefined;
                        }
                        /**
                         * Reset this flag as the
                         * next scroll interaction could
                         * be a scroll from the user. In this
                         * case, we should exit input mode.
                         */
                        this.canExitInputMode = true;
                        this.setValue(newActiveElement.value);
                    }, 250);
                });
            };
            /**
             * Wrap this in an raf so that the scroll callback
             * does not fire when component is initially shown.
             */
            raf(() => {
                if (!scrollEl)
                    return;
                scrollEl.addEventListener('scroll', scrollCallback);
                this.destroyScrollListener = () => {
                    scrollEl.removeEventListener('scroll', scrollCallback);
                };
            });
        };
        /**
         * Tells the parent picker to
         * exit text entry mode. This is only called
         * when the selected item changes during scroll, so
         * we know that the user likely wants to scroll
         * instead of type.
         */
        this.exitInputMode = () => {
            const { parentEl } = this;
            if (parentEl == null)
                return;
            parentEl.exitInputMode();
            /**
             * setInputModeActive only takes
             * effect once scrolling stops to avoid
             * a component re-render while scrolling.
             * However, we want the visual active
             * indicator to go away immediately, so
             * we call classList.remove here.
             */
            this.el.classList.remove('picker-column-active');
        };
        this.isActive = false;
        this.disabled = false;
        this.value = undefined;
        this.color = 'primary';
        this.numericInput = false;
    }
    valueChange() {
        if (this.isColumnVisible) {
            /**
             * Only scroll the active item into view when the picker column
             * is actively visible to the user.
             */
            this.scrollActiveItemIntoView(true);
        }
    }
    /**
     * Only setup scroll listeners
     * when the picker is visible, otherwise
     * the container will have a scroll
     * height of 0px.
     */
    componentWillLoad() {
        /**
         * We cache parentEl in a local variable
         * so we don't need to keep accessing
         * the class variable (which comes with
         * a small performance hit)
         */
        const parentEl = (this.parentEl = this.el.closest('ion-picker'));
        const visibleCallback = (entries) => {
            /**
             * Browsers will sometimes group multiple IO events into a single callback.
             * As a result, we want to grab the last/most recent event in case there are multiple events.
             */
            const ev = entries[entries.length - 1];
            if (ev.isIntersecting) {
                const { activeItem, el } = this;
                this.isColumnVisible = true;
                /**
                 * Because this initial call to scrollActiveItemIntoView has to fire before
                 * the scroll listener is set up, we need to manage the active class manually.
                 */
                const oldActive = getElementRoot(el).querySelector(`.${PICKER_ITEM_ACTIVE_CLASS}`);
                if (oldActive) {
                    this.setPickerItemActiveState(oldActive, false);
                }
                this.scrollActiveItemIntoView();
                if (activeItem) {
                    this.setPickerItemActiveState(activeItem, true);
                }
                this.initializeScrollListener();
            }
            else {
                this.isColumnVisible = false;
                if (this.destroyScrollListener) {
                    this.destroyScrollListener();
                    this.destroyScrollListener = undefined;
                }
            }
        };
        /**
         * Set the root to be the parent picker element
         * This causes the IO callback
         * to be fired in WebKit as soon as the element
         * is visible. If we used the default root value
         * then WebKit would only fire the IO callback
         * after any animations (such as a modal transition)
         * finished, and there would potentially be a flicker.
         */
        new IntersectionObserver(visibleCallback, { threshold: 0.001, root: this.parentEl }).observe(this.el);
        if (parentEl !== null) {
            // TODO(FW-2832): type
            parentEl.addEventListener('ionInputModeChange', (ev) => this.inputModeChange(ev));
        }
    }
    componentDidRender() {
        const { el, activeItem, isColumnVisible, value } = this;
        if (isColumnVisible && !activeItem) {
            const firstOption = el.querySelector('ion-picker-column-option');
            /**
             * If the picker column does not have an active item and the current value
             * does not match the first item in the picker column, that means
             * the value is out of bounds. In this case, we assign the value to the
             * first item to match the scroll position of the column.
             *
             */
            if (firstOption !== null && firstOption.value !== value) {
                this.setValue(firstOption.value);
            }
        }
    }
    /** @internal  */
    async scrollActiveItemIntoView(smooth = false) {
        const activeEl = this.activeItem;
        if (activeEl) {
            this.centerPickerItemInView(activeEl, smooth, false);
        }
    }
    /**
     * Sets the value prop and fires the ionChange event.
     * This is used when we need to fire ionChange from
     * user-generated events that cannot be caught with normal
     * input/change event listeners.
     * @internal
     */
    async setValue(value) {
        if (this.disabled === true || this.value === value) {
            return;
        }
        this.value = value;
        this.ionChange.emit({ value });
    }
    /**
     * Sets focus on the scrollable container within the picker column.
     * Use this method instead of the global `pickerColumn.focus()`.
     */
    async setFocus() {
        if (this.scrollEl) {
            this.scrollEl.focus();
        }
    }
    get activeItem() {
        const { value } = this;
        const options = Array.from(this.el.querySelectorAll('ion-picker-column-option'));
        return options.find((option) => {
            /**
             * If the whole picker column is disabled, the current value should appear active
             * If the current value item is specifically disabled, it should not appear active
             */
            if (!this.disabled && option.disabled) {
                return false;
            }
            return option.value === value;
        });
    }
    render() {
        const { color, disabled, isActive, numericInput } = this;
        const mode = getIonMode(this);
        return (h(Host, { key: '59648ef23cef1ab6d30955bb95bc23e670ec7256', class: createColorClasses(color, {
                [mode]: true,
                ['picker-column-active']: isActive,
                ['picker-column-numeric-input']: numericInput,
                ['picker-column-disabled']: disabled,
            }) }, h("slot", { key: 'fd93192d4945b2c33e0fe93cc90b505f2cec12fc', name: "prefix" }), h("div", { key: '99e49c6d58badd2fe5e75f0ebcd4bc00eb50aa58', class: "picker-opts", tabindex: disabled ? undefined : 0, ref: (el) => {
                this.scrollEl = el;
            } }, h("div", { key: 'bb44892ef179b25373e45e4b4bc4d1fa617b1ea1', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '9ee7aeb8468bbb03f7192d56849dae089b7a0250', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '0baa4bda4bf02a8d06dbf3392b1516ca8ea8d26a', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("slot", { key: 'ff4cad20fd82ab66599473f60d10c18dc1dc76d8' }), h("div", { key: '04dcb0390209081e6223b90e45b8f2ef0fdf94bd', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '734e3b431a30ce93957e1452516efc86e29ff9c9', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0"), h("div", { key: '1c68dcf9a029e607bb6bc9c19cd02214914eb6d7', class: "picker-item-empty", "aria-hidden": "true" }, "\u00A0")), h("slot", { key: 'd85210cc99c8c1bf83eb1cd51540ebe875d4adeb', name: "suffix" })));
    }
    static get is() { return "ion-picker-column"; }
    static get encapsulation() { return "shadow"; }
    static get originalStyleUrls() {
        return {
            "$": ["picker-column.scss"]
        };
    }
    static get styleUrls() {
        return {
            "$": ["picker-column.css"]
        };
    }
    static get properties() {
        return {
            "disabled": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [],
                    "text": "If `true`, the user cannot interact with the picker."
                },
                "attribute": "disabled",
                "reflect": false,
                "defaultValue": "false"
            },
            "value": {
                "type": "any",
                "mutable": true,
                "complexType": {
                    "original": "string | number",
                    "resolved": "number | string | undefined",
                    "references": {}
                },
                "required": false,
                "optional": true,
                "docs": {
                    "tags": [],
                    "text": "The selected option in the picker."
                },
                "attribute": "value",
                "reflect": false
            },
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
                "reflect": true,
                "defaultValue": "'primary'"
            },
            "numericInput": {
                "type": "boolean",
                "mutable": false,
                "complexType": {
                    "original": "boolean",
                    "resolved": "boolean",
                    "references": {}
                },
                "required": false,
                "optional": false,
                "docs": {
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }],
                    "text": "If `true`, tapping the picker will\nreveal a number input keyboard that lets\nthe user type in values for each picker\ncolumn. This is useful when working\nwith time pickers."
                },
                "attribute": "numeric-input",
                "reflect": false,
                "defaultValue": "false"
            }
        };
    }
    static get states() {
        return {
            "isActive": {}
        };
    }
    static get events() {
        return [{
                "method": "ionChange",
                "name": "ionChange",
                "bubbles": true,
                "cancelable": true,
                "composed": true,
                "docs": {
                    "tags": [],
                    "text": "Emitted when the value has changed."
                },
                "complexType": {
                    "original": "PickerColumnChangeEventDetail",
                    "resolved": "PickerColumnChangeEventDetail",
                    "references": {
                        "PickerColumnChangeEventDetail": {
                            "location": "import",
                            "path": "./picker-column-interfaces",
                            "id": "src/components/picker-column/picker-column-interfaces.ts::PickerColumnChangeEventDetail"
                        }
                    }
                }
            }];
    }
    static get methods() {
        return {
            "scrollActiveItemIntoView": {
                "complexType": {
                    "signature": "(smooth?: boolean) => Promise<void>",
                    "parameters": [{
                            "name": "smooth",
                            "type": "boolean",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "",
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }]
                }
            },
            "setValue": {
                "complexType": {
                    "signature": "(value: PickerColumnValue) => Promise<void>",
                    "parameters": [{
                            "name": "value",
                            "type": "string | number | undefined",
                            "docs": ""
                        }],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        },
                        "PickerColumnValue": {
                            "location": "import",
                            "path": "./picker-column-interfaces",
                            "id": "src/components/picker-column/picker-column-interfaces.ts::PickerColumnValue"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "Sets the value prop and fires the ionChange event.\nThis is used when we need to fire ionChange from\nuser-generated events that cannot be caught with normal\ninput/change event listeners.",
                    "tags": [{
                            "name": "internal",
                            "text": undefined
                        }]
                }
            },
            "setFocus": {
                "complexType": {
                    "signature": "() => Promise<void>",
                    "parameters": [],
                    "references": {
                        "Promise": {
                            "location": "global",
                            "id": "global::Promise"
                        }
                    },
                    "return": "Promise<void>"
                },
                "docs": {
                    "text": "Sets focus on the scrollable container within the picker column.\nUse this method instead of the global `pickerColumn.focus()`.",
                    "tags": []
                }
            }
        };
    }
    static get elementRef() { return "el"; }
    static get watchers() {
        return [{
                "propName": "value",
                "methodName": "valueChange"
            }];
    }
}
const PICKER_ITEM_ACTIVE_CLASS = 'option-active';
