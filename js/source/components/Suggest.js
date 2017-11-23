import React, {Component, PropTypes } from 'react';

class Suggest extends Component {
    getValue() {
        return this.refs.lowlevelinput.value;
    }

    render () {
        const randomid = Math.random().toString(16).substring(2);
        return (
            <div>
                <input 
                    list={randomid}
                    defaultValue = {this.props.defaultValue}
                    ref = "lowlevelinput"
                    id = {this.props.id} />
                    <datalist id={randomid}> {
                        this.props.options.map((item, idx) => 
                        <option value={item} key={idx} />
                        )
                    }</datalist>
                    </div>

        );
    }
}

Suggest.PropTypes = {
    options : PropTypes.arrayOf(PropTypes.string),
}

export default Suggest;