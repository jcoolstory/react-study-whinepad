'use strict';
import React from 'react';
import ReactDOM from 'react-dom';
import Whinepad from './components/Whinepad';
import Logo from './components/Logo';
import Excel from './components/Excel';
import schema from './schema';
import FormInput from './components/FormInput';

//var headers = localStorage.getItem('headers');
var data  = localStorage.getItem('data');

if (!data){
    data={};
    schema.forEach(item=>data[item.id] = item.sample)
    data = [data];
}


ReactDOM.render(
    <div>
        <div className="app-header">
            <Logo />Welcom to Whinepad!
        </div>
        <Whinepad schema={schema} initialData={data} />
    </div>,
    document.getElementById('pad')
)
