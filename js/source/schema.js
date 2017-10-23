import classification from './classification';

export default [
    {
        id:'name',
        label:'Name',
        show:true,
        sample : '$2 check',
        align : 'left'
    },
    {
        id:'year',
        label:'Year',
        type:'year',
        show:true,
        sample:2015,
    },
    {
        id : 'grape',
        label:'Grape',
        type:'suggest',
        options:classification.grapes,
        show:true,
        sample:'Merlot',
        align:'left',
    },
    {
        id:'rationg',
        label : 'Rationg',
        type : 'rating',
        show : true,
        sample :3,
    },
    {
        id:'comments',
        label:'Comments',
        type : 'text',
        sample:'Nice for the price',
    }

]