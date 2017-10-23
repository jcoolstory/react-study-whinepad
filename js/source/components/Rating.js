import classNames from 'classnames';
import React, {Component, PropTypes } from 'react';

class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rating:props.defaultValue,
            tmpRating:props.defaultValue
        };
    }

    getValue() {
        return this.state.rating;
    }

    setTemp(rating) {
        this.setState({
            tmpRating: rating,
            rating: rating,
        });
    }

    setRating(rating) {
        this.setState({
            tmpRating : rating,
            rating:rating
        })
    }

    reset() {
        this.setTemp(this.state.rating);
    }

    componentWillReceiveProps(nextProps) {
        this.setRating(nextProps.defaultValue);
    }

    render(){    
        const stars = [];
        return ( 
            <div 
                className={classNames({
                    'Rating':true,
                    'RatingReadonly':this.props.readonly,
                })} 

                onMouseOut={this.reset.bind(this)}
                >
            {stars}
            {this.props.readonly || !this.props.id ? null
                : <input
                    type='hidden'
                    id={this.props.id}
                value={this.state.rating} />
            }
            </div>
        );
    }
}

class Comp extends Component {
    constructor(props) {
        super(props);
        this.method = this.method.bind(this);
    }

    render(){
        return <button onClick={this.method} />
    }
}

Rating.PropTypes = {
    defaultValue : PropTypes.number,
    readonly : PropTypes.bool,
    max : PropTypes.number,
}
export default Rating;