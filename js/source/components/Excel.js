import Actions from './Actions';
import Dialog from './Dialog';
import Form from './Form';
import FormInput from './FormInput';
import Rating from './Rating';
import React, {Component, PropTypes } from 'react';
import classNames from 'classnames';

var headers = [
    "Book", "Author", "Language", "Published", "Sales"
];

var data = [
    ["The load of the raings", "j.r.r. tolkien","english","1954.1955","150 million"],
    ["2The load of the raings", "j.r.r. tolkien","english","1954.1955","150 million"],
    ["ahe load of the raings", "j.r.r. tolkien","english","1954.1955","150 million"],
    ["1The load of the raings", "j.r.r. tolkien","english","1954.1955","150 million"],
    ["dhe load of the raings", "j.r.r. tolkien","english","1954.1955","150 million"],
    ["she load of the raings", "j.r.r. tolkien","english","1954.1955","150 million"],
]

class Excel extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: this.props.initialData,
            sortby : null,
            descending: false,
            edit : null,
            dialog : null,

        };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({data: nextProps.initialData});
    }

    _fireDataChange(data){
        this.props.onDataChange(data);
    }

    _sort(key){
        let data = Array.from(this.state.data);

        const descending = this.state.sortby == key && !this.state.descending;

        data.sort(function(a,b){
            return descending
                ? (a[column] < b[column] ? 1:-1)
                : (a[column] < b[column] ? 1:-1);
        });

        this.setState({
            data:data,
            sortby : key,
            descending : descending,
        });

        this._fireDataChange(data);
    }

    _showEditor(e) {
        this.setState( { edit : {
            row: parseInt(e.target.dataset.row,10),
            key : e.target.dataset.key,
        }});
    }

    _save(e) {
        e.preventDefault();
        const value = this.refs.input.getValue();
        let data = Array.from(this.state.data);
        data[this.state.edit.row][this.state.edit.key] = value;
        this.setState({
            edit:null,
            data:data
        });
        this._fireDataChange(data);
    }

    _actionClick(rowidx, action){
        this.setState({dialog : {type: action, idx:rowidx}});
    }

    _deleteConfirmationClick(action) {
        if (action =='dismiss'){
            this._closeDialog();
            return;
        }

        let data = Array.from(this.state.data);
        data.splice(this.state.dialog.idx,1);
        this.setState({
            dialog:null,
            data:data
        });
        this._fireDataChange(data);
    }

    _closeDialog() {
        this.setState({dialog:null});
    }

    _saveDataDialog(action){
        if (action == 'dissmiss') {
            this._closeDialog();
            return;
        }

        let data = Array.from(this.state.data);
        data[this.state.dialog.idx] = this.refs.form.getData();
        this.setState( { 
            dialog:null,
            data : data,
        });
        this._fireDataChange(data);
    }

    render() {
        return (
            <div className='Excel'>
                {this._renderTable()}
                {this._renderDialog()}
            </div>
        );
    }

    _renderDialog() {
        if (!this.state.dialog){
            return null;
        }

        switch(this.state.dialog.type){
            case 'delete':
                return this._renderDeleteDialog();
            case 'info':
                return this._renderFormDialog(true);
            case 'edit':
                return this._renderFormDialog();
            default:
                throw Error('Unexpected dialog type ${this.state.dialog.type');
        }
    }

    _renderDeleteDialog() {
        const first = this.state.data[this.state.dialog.idx];
        const nameguess = first[Object.keys(first)[0]];
        return (
            <Dialog 
                modal={true}
                header = 'Confirm deletion'
                confirmLabel = 'Delete'
                onAction = {this._deleteConfirmationClick.bind(this)}
                >
                {'Are you sure you wan to delete "${nameguess}"?'}
            </Dialog>
        )
    }

    _renderFormDialog(readonly) {
        return (
            <Dialog
                modal={true}
                header={readonly ? 'Item info' : 'Edit item'}
                confirmLabel={readonly ? 'ok' : 'Save' }
                hasCancel={!readonly}
                onAction={this._saveDataDialog.bind(this)}
            >
            <Form 
                ref="form"
                fields={this.props.schema}
                initialData={this.state.data[this.state.dialog.idx]}
                readonly={readonly} />                

            </Dialog>
        )
    }

    _renderTable(){
        return (
            <table>
                <thead>
                    <tr>{
                        this.props.schema.map(item => {
                            if (!item.show){
                                return null;
                            }

                            let title = item.label;
                            if (this.state.sortby == item.id){
                                title += this.state.descending ? '\u2191' : ' \u2193';
                            }
                            return (
                                <th
                                    className={'schema-${item.id}'}
                                    key={item.id}
                                    onClick={this._sort.bind(this, item.id)}
                                    >
                                    {title}
                                </th>
                            );
                        }, this)
                    }
                    <th className="ExcelNOtSortable">Actions</th>
                    </tr>
                </thead>
                <tbody onDoubleClick={this._showEditor.bind(this)}>
                    {this.state.data.map((row, rowidx) => {
                        return (
                            <tr key={rowidx}>{
                                Object.keys(row).map((cell,idx)=> {
                                    const schema = this.props.schema[idx];
                                    if (!schema || !schema.show){
                                        return null;
                                    }

                                    const isRating = schema.type == 'rating';
                                    const edit = this.state.edit;
                                    let content = row[cell];
                                    if (!isRating && edit && edit.row == rowidx && edit.key === schema.id){
                                        content = (
                                            <form onSubmit = {this._save.bind(this)}>
                                                <FormInput ref="input" {...schema}
                                                defaultValue={content} />
                                            </form>
                                        );
                                    } else if (isRating){
                                        content = <Rating readonly={true}
                                            defaultValue={Number(content)} />;
                                    }

                                    return (
                                        <td 
                                            className={classNames({
                                                ['schema-${schema.id'] : true,
                                                'ExcelEditable': !isRating,
                                                'ExcelDataLeft':schema.align =='left',
                                                'ExcelDataRight': schema.align == 'right',
                                                'ExcelDataCenter': schema.align != 'left' && schema.align !== 'right',
                                            })}
                                            key={idx}
                                            data-row={rowidx}
                                            data-key={schema.id}>
                                            {content}
                                        </td>                                        
                                    );

                                }, this)}
                                <td className="ExcelDataCenter">
                                    <Actions onAction={this._actionClick.bind(this, rowidx)} />
                                </td>
                            </tr>
                        );
                    }, this)}
                    </tbody>
                </table>
            );
        }
}

Excel.PropTypes = {
    schema : PropTypes.arrayOf(
        PropTypes.object
    ),
    onDataChange:PropTypes.func
};

export default Excel;

// var Excel = React.createClass({
//     displayName:'Excel',
//     _preSearchData: null,
//     getInitialState : function () {
//         return {
//             data : this.props.initialData,
//             sortby : null,
//             descending : false,
//             edit : null, // {row:index. cell:index}
//             search : false
//         };
//     },
//     render : function (){
//        return (
//            <div className="Excel">
//                {this._renderToolbar()}
//                {this._renderTable()}
//                </div>           
           
//            )
//     },
//     _renderToolbar : function(){
//         return React.DOM.button({
//             onClick : this._toggleSearch,
//             className:'toolbar',
//         },
//         'search'); 
        
//     },
//     _renderSearch : function() {
//         if (!this.state.search){
//             return null;
//         }

//         return (
//             React.DOM.tr( { onChange: this._search},
//                 this.props.headers.map(function(_ignore,idx){
//                     return React.DOM.td({key:idx},
//                     React.DOM.input({
//                         type:'text',
//                         'data-idx':idx,
//                     }))
//                 })
//             )
//         )
//     },
//     _renderTable : function(){
//         return (
//             React.DOM.table(null,
//             React.DOM.thead({onClick:this._sort},
//             React.DOM.tr(null,
//                 this.props.headers.map(function(title,idx){
//                     if (this.state.sortby === idx)
//                         title += (this.state.descending ? '\u2191' : '\u2193')
//                     return React.DOM.th({key:idx}, title);
//                 },this))),
//                 React.DOM.tbody({onDoubleClick:this._showEditor}, 
//                     this._renderSearch(),
//                     this.state.data.map(function(row,rowidx){
//                         return (
//                             React.DOM.tr({key:rowidx},
//                             row.map(function(cell, idx){                               

//                                 var content = cell;

//                                 if (this.state.edit && this.state.edit.row === rowidx && this.state.edit.cell == idx){
//                                     content = React.DOM.form({ onBlur:this._save},
//                                         React.DOM.input({
//                                             type:'text',
//                                             defaultValue : content,
//                                         }))
//                                 }
//                                 return React.DOM.td({key:idx,'data-row':rowidx}, content)
//                             },this))
//                         );
//                     },this))
//             )            
//         );
//     },
//     _toggleSearch : function(){
//         if (this.state.search) {
//             this.setState({
//                 data: this._preSearchData,
//                 search : false,
//             });

//             this._preSearchData = null;
//         } else {
//             this._preSearchData = this.state.data;
//             this.setState( {
//                 search: true,
//             })
//         }
//     },
//     _search : function(e){
//         var needle = e.target.value.toLowerCase();
//         if (!needle){
//             this.setState( { data : this._preSearchData });
//             return;
//         }

//         var idx = e.target.dataset.idx;
//         var searchdata = this._preSearchData.filter( function ( row ) {
//             return row[idx].toString().toLowerCase().indexOf(needle) > -1;            
//         })
//         this.setState( { data : searchdata});
//     },
//     _save :function(e){
//         console.log(e.target);
//         var data = this.state.data.slice();
        
//         var input = e.target;
//         data[this.state.edit.row][this.state.edit.cell]=input.value;
//         this.setState({
//             edit:null,
//             data:data
//         })    
//     },
//     _showEditor :function (e){
//         console.log("double",this.state,e.target.cellIndex)
//         this.setState({edit:{
//             row:parseInt(e.target.dataset.row,10),
//             cell:e.target.cellIndex
//         }})
//     }
//     ,
//     propTypes : {
//         headers : React.PropTypes.arrayOf (
//             React.PropTypes.string
//         ),
//         initalData : React.PropTypes.arrayOf(
//             React.PropTypes.arrayOf(
//                 React.PropTypes.number
//             )
//         )
//     },
//     _sort : function(e){
//         var column = e.target.cellIndex;
//         var data = this.state.data.slice();
//         var descending = this.state.sortby === column && !this.state.descending;
//         data.sort(function(a,b){

//             return  descending ?
//                 (a[column] > b[column]) : (a[column] < b[column]);
//         }),
//         console.log(descending)
//         this.setState({
//             data : data,
//             sortby : column,
//             descending : descending
//         });
//     }
// })

// export default Excel
// // ReactDOM.render(
// //     React.createElement(Excel, {headers:headers,
// //     initialData:data,}),
// //     document.getElementById("app")
// // )