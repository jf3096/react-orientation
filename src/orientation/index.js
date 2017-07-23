import React, {Component, PropTypes} from "react";
import debounce from "lodash.debounce";
import images from "./image/index";
import "./index.css";

const prefix = `orientation`;

export default class Orientation extends Component {
    /**
     * debounce 延迟时间
     * 这里不使用静态为了节约空间
     * @type {number}
     */
    DEBOUNCE_DELAY = 300;

    static defaultProps = {
        vertical: true
    };

    constructor(props) {
        super(props);
        if (!this.useProps()) {
            this.state = {
                visible: false
            };
        }
    }

    componentWillMount() {
        const documentElement = document.documentElement;
        const resizeEvent = 'orientationchange' in window ? 'orientationchange' : 'resize';
        if (!document.addEventListener) {
            return
        }
        /**
         * 性能优化, debounce
         */
        const recalculate = debounce(this.recalculate.bind(this, documentElement), this.DEBOUNCE_DELAY);
        window.addEventListener(resizeEvent, recalculate, false);
        document.addEventListener('DOMContentLoaded', recalculate, false);
    }

    recalculate(documentElement) {
        const {clientWidth, clientHeight} = documentElement;
        /**
         * 如果高度大于宽度, 提示请使用竖屏
         * @type {boolean}
         */
        const visible = this.calculateVisibility(clientWidth, clientHeight);
        if (this.useProps()) {
            this.props.onChange(visible);
        }
        else {
            this.setState({visible});
        }
    }

    /**
     * 根据props.vertical决定是否最后显示当前组件
     * @param clientWidth
     * @param clientHeight
     * @returns {boolean}
     */
    calculateVisibility(clientWidth, clientHeight) {
        const {vertical} = this.props;
        const visible = clientWidth > clientHeight;
        return vertical ? visible : !visible;
    }


    useProps() {
        return `visible` in this.props;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.useProps()) {
            return nextProps.visible !== this.props.visible;
        }
        else {
            return nextState.visible !== this.state.visible;
        }
    }

    //noinspection JSMethodCanBeStatic
    renderContent() {
        return (
            <div className={prefix} style={{display: `block`}}>
                <div className={`${prefix}-box`}>
                    <img className={`${prefix}-img`} src={images.phone} alt="请将手机/平板横过来"/>
                    <span className={`${prefix}-text`}>为了更好的体验，请将手机/平板横过来</span>
                </div>
            </div>
        )
    }

    getVisible() {
        return this.useProps() ? this.props.visible : this.state.visible;
    }

    render() {
        const visible = this.getVisible();
        return visible ? this.renderContent() : null;
    }
}

const {bool, func} = PropTypes;

Orientation.propTypes = {
    /**
     * 是否垂直
     */
    vertical: PropTypes.bool,
    /**
     * 是否显示, 默认交给内部state处理
     */
    visible: PropTypes.bool,
    /**
     * visible变更回调事件
     */
    onChange: PropTypes.func
};
