import React, {
    PureComponent
} from 'react';

import DOM from 'core/browser/DOM';
import { memoizeOne } from 'core/memoizer';

import MarkdownHighlighter from 'dash-table/utils/MarkdownHighlighter';

interface IProps {
    active: boolean;
    applyFocus: boolean;
    className: string;
    value: any;
}

export default class CellMarkdown extends PureComponent<IProps, {}> {

    getMarkdown = memoizeOne((value: string, _ready: any) => ({
        dangerouslySetInnerHTML: {
            __html: MarkdownHighlighter.render(String(value))
        }
    }));

    constructor(props: IProps) {
        super(props);

        if (MarkdownHighlighter.isReady !== true) {
            MarkdownHighlighter.isReady.then(() => { this.setState({}); });
        }
    }

    componentDidUpdate() {
        this.setFocus();
    }

    componentDidMount() {
        this.setFocus();
    }

    render() {
        const {
            className,
            value
        } = this.props;

        return (<div
            ref='el'
            className={[className, 'cell-markdown'].join(' ')}
            {...this.getMarkdown(value, MarkdownHighlighter.isReady)}
        />);
    }

    private setFocus() {
        const { active, applyFocus } = this.props;
        if (!active) {
            return;
        }

        const el = this.refs.el as any;

        if (applyFocus && el && document.activeElement !== el) {
            // Limitation. If React >= 16 --> Use React.createRef instead to pass parent ref to child
            const tdParent = DOM.getFirstParentOfType(el, 'td');
            if (tdParent) {
                tdParent.focus();
            }
        }
    }

}
