import React from 'react';
import ReactDOM from 'react-dom';

import ReactTable from "react-table";
import "react-table/react-table.css";

var lifters =[ 
  {name : 'Adam'    , sqt1:100 , sqt2:105},
  {name : 'Bob'     , sqt1:200 , sqt2:220},
  {name : 'Charlie' , sqt1:90  , sqt2:110},
];


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lifters: lifters,
      currattempt:1,
      currlifter :0
    };
  }

goodlift(){ 
  var nextattempt = null; 
  var nextlifter = null;
  
  if (this.state.currlifter === lifters.length-1 && this.state.currattempt < 3 ) { //reached end of attempt; move to next
    nextattempt = this.state.currattempt +1; 
    nextlifter = 0 ;
  } else if (this.state.currlifter < lifters.length -1 && this.state.currattempt < 3) { // same attempt; next lifter 
    nextattempt=this.state.currattempt;
    nextlifter = this.state.currlifter + 1; 
  }
  
  let updatelifter =[...this.state.lifters]
  updatelifter[this.state.currlifter].sqt1_res=true; // this needs to be dynamic based on the attempt
  this.setState({
    currlifter: nextlifter,
    currattempt: nextattempt,
    lifters: updatelifter

  })
}
badlift(){
}
  render() { 
  
  if(this.state.currattempt===1){
    var sqt_sort = lifters.sort(function(a, b){return a.sqt1-b.sqt1});
    var currsquat = sqt_sort[this.state.currlifter].sqt1;
  }else if (this.state.currattempt===2){
    sqt_sort = lifters.sort(function(a, b){return a.sqt2-b.sqt2});
    currsquat = sqt_sort[this.state.currlifter].sqt2;
  } else {
    sqt_sort = lifters.sort(function(a, b){return a.sqt3-b.sqt3});
    currsquat = sqt_sort[this.state.currlifter].sqt3;
  }
  
  console.log("lift", this.state.currlifter,"attempt", this.state.currattempt,this.state.lifters);

    return (
      <div>
        Current Lifter: {sqt_sort[this.state.currlifter].name} <br /> 
        Current Squat : {currsquat} <br />

      <button onClick={() => this.goodlift()}> Good Lift </button> 
      <button onClick={() => this.badlift() }> Bad Lift </button>

      <Liftertable lifters={this.state.lifters}/>
      </div>
    );
  }
}

class Liftertable extends React.Component{
 
  render() {
    return (
      <div>
        <ReactTable
          data= {this.props.lifters}
          columns={ [
            {
              Header: "Name",
              accessor: "name"        
            },
            {
              Header: "Squat 1",
              accessor: "sqt1",
            },
            { 
              Header: "Squat 1 Res",
              accesor:"sqt1_res",
            },
            {
              Header: "Squat 2",
              accessor: "sqt2"
            },
          ]}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        </div>
    );
  }
}




ReactDOM.render(
  <App />,
  document.getElementById('root')
);