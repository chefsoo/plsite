import React from 'react';
import ReactDOM from 'react-dom';

import ReactTable from "react-table";
import ReactCountdownClock from "react-countdown-clock";

import "react-table/react-table.css";

var lifters =[ 
  {name : 'Adam'    , sqt1:86 ,  sqt2:95, sqt3: 102},
  {name : 'Bob'     , sqt1:173 ,  sqt2:184, sqt3: 193},
  {name : 'Charlie' , sqt1:100  ,  sqt2:110, sqt3: 120},
];


var initialsort = lifters.sort(function(a, b){return a.sqt1-b.sqt1})

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lifters: initialsort,
      currattempt:1,
      currlifter :0,
      timerpaused: true,
      time:60
    };
  }
nextlift(res){ 
  // set the result of the lift 
  let updatelifter =[...this.state.lifters]
  if(this.state.currattempt ===1 ) updatelifter[this.state.currlifter].sqt1_res=res;
  if(this.state.currattempt ===2 ) updatelifter[this.state.currlifter].sqt2_res=res;
  if(this.state.currattempt ===3 ) updatelifter[this.state.currlifter].sqt3_res=res;

  //if end of attempt, reset the sort
  // increment lifter by 1 mod # of lifters 
  var nextattempt = this.state.currattempt;
  var nextlifter =  (this.state.currlifter + 1) % this.state.lifters.length ;
  var newtime = this.state.time + 0.0000001;
  if (this.state.currlifter === lifters.length-1 && this.state.currattempt ===1 ) { //reached end of attempt; move to next
    updatelifter = updatelifter.sort(function(a, b){return a.sqt2-b.sqt2}); 
    nextattempt= this.state.currattempt + 1 % 3 ;
  } else if (this.state.currlifter === lifters.length-1 && this.state.currattempt ===2){
    updatelifter = updatelifter.sort(function(a, b){return a.sqt3-b.sqt3}); 
     nextattempt= this.state.currattempt + 1 % 3 ;
  };


  this.setState({
    currlifter: nextlifter,
    currattempt: nextattempt,
    lifters: updatelifter,
    timerpaused: true,
    time:newtime
  });
}
starttimer(){
  var updatetimepause=false;
  this.setState({
    timerpaused: updatetimepause
  });
}
  render() { 
  
  if(this.state.currattempt===1){
    var currsquat = this.state.lifters[this.state.currlifter].sqt1;
  }else if (this.state.currattempt===2){
    currsquat = this.state.lifters[this.state.currlifter].sqt2;
  } else {
    currsquat = this.state.lifters[this.state.currlifter].sqt3;
  }
  
  // 
  console.log("lift", this.state.currlifter,"attempt", this.state.currattempt,this.state.lifters);

    return (
      <div >
      <div >
        Current Lifter: {this.state.lifters[this.state.currlifter].name} <br /> 
        Current Squat : {currsquat} <br />
        Attempt: {this.state.currattempt} <br />
      <button onClick={() => this.starttimer() }> Bar is Loaded </button> <br/> <br/>
      <button onClick={() => this.nextlift(true)}> Good Lift </button> 
      <button onClick={() => this.nextlift(false) }> Bad Lift </button> <br/>
      <button onClick={() => this.nextlift(null) }> Next lifter </button>
      <button> Previous lifter </button>
      

      <ReactCountdownClock seconds={this.state.time}
        color="#000"
        alpha={1}
        size={100}
        paused ={this.state.timerpaused} />
      <BarbellCalc 
        lifters={this.state.lifters} currlifter={this.state.currlifter}/>
      </div>
      <div>
      <Liftertable lifters={this.state.lifters}/>
      </div>
      </div>
    );
  }
}

class Liftertable extends React.Component{

  render() {
    return (
      <div>
        <ReactTable
          columns={ [
            {
              Header: "Name",
              accessor: "name"        
            },
            {
              Header: "Squat 1",
              accessor: "sqt1",
              Cell: ({row,original})   => (
                <div style={{
                  backgroundColor: original.sqt1_res === true ? '#85cc00'
                    : original.sqt1_res === false? '#FF0000'
                    : '#ffffff',
                }}> {row.sqt1} </div>
              )
            },
            {
              Header: "Squat 2",
              accessor: "sqt2",
              Cell: ({row,original})   => (
                <div style={{
                  backgroundColor: original.sqt2_res === true ? '#85cc00'
                    : original.sqt2_res === false? '#FF0000'
                    : '#ffffff',
                }}> {row.sqt2} </div>
              )
            },
            {
              Header: "Squat 3",
              accessor: "sqt3",Cell: ({row,original})   => (
                <div style={{
                  backgroundColor: original.sqt3_res === true ? '#85cc00'
                    : original.sqt3_res === false? '#FF0000'
                    : '#ffffff',
                }}> {row.sqt3} </div>
              )
            },
          ]}
          data= {this.props.lifters}
          onFetchData={this.fetchData}
          defaultPageSize={10}
          className="-striped -highlight"
        />
        </div>
    );
  }
}

const plateinv = [ 
  [25,   6],
  [20,   2],
  [15,   2],
  [10,   2],
  [5,    2],
  [2.5,  2],
  [1.25, 2],
  [.5,   2],
  [.25,  2],
]
const bar = 20; 
const collar = 2.5; 

var loadedbar = [ 
  [25, 0],
  [20, 0],
  [15, 0],
  [10, 0],
  [5, 0],
  [2.5, 0],
  [1.25, 0],
  [.5, 0],
  [.25, 0],
]
class BarbellCalc extends React.Component{
  
  render() {
      var remainder= this.props.lifters[this.props.currlifter].sqt1 - bar - collar*2;
      var bar_rhs =[];
      for (var i =0; i<loadedbar.length; i++){
          loadedbar[i][1]=Math.min(Math.floor(remainder/(2*loadedbar[i][0]),plateinv[i][1]));
          remainder= remainder - loadedbar[i][0]* loadedbar[i][1] *2;
          
          for(var j=0; j<loadedbar[i][1];j++){
              bar_rhs.push( loadedbar[i][0] + " ")
          };
      };
      bar_rhs.push("Collar")
      console.log(bar_rhs)

      return(
          <div>{bar_rhs} </div>
      )
  }

};


ReactDOM.render(
  <App />,
  document.getElementById('root')
);