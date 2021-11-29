// import React from "react"
// import sl1 from "../assets/images/sl1.png"; 
// import sl2 from "../assets/images/sl2.png"; 
// import sl3 from "../assets/images/sl3.png"; 
// import sl4 from "../assets/images/sl4.png"; 

// const { createRef , Component } = React;

// class Slots extends Component {
//   static defaultProps = {
//     fruits: [sl1,sl2,sl3,sl4]
//   };

//   constructor(props) {
//     super(props);
//     this.state = { 
      
//       fruit1: sl1, fruit2: sl1, fruit3: sl1, rolling: false
  
//   };

//     // get ref of dic onn which elements will roll
//     this.slotRef = [createRef(), createRef(), createRef()];
//   }

//   // to trigger roolling and maintain state
//   roll = () => {
//     this.setState({
//       rolling: true
//     });
//     setTimeout(() => {
//       this.setState({ rolling: false });
//     }, 700);

//     // looping through all 3 slots to start rolling
//     this.slotRef.forEach((slot, i) => {
//       // this will trigger rolling effect
//       while(1) {
//         const selected = this.triggerSlotRotation(slot.current);
//         this.setState({ [`fruit${i + 1}`]: selected });
//       }
//     });
//   };

//   // this will create a rolling effect and return random selected option
//   triggerSlotRotation = ref => {
//     function setTop(top) {
//       ref.style.top = `${top}px`;
//     }
//     let options = ref.children;
//     let randomOption = Math.floor(
//       Math.random() * Slots.defaultProps.fruits.length
//     );
//     let choosenOption = options[randomOption];
//     setTop(-choosenOption.offsetTop + 2);
//     return Slots.defaultProps.fruits[randomOption];
//   };

//   render() {
//     return (
//       <div className="SlotMachine">

//         {/* {this.roll} */}
//         {/* {this.state.rolling && this.roll} */}

//         <div className="slot">
//           <section>
//             <div className="container" ref={this.slotRef[0]}>
//               {Slots.defaultProps.fruits.map((fruit, i) => (
//                 <div key={i}>
//                   {/* <span>{fruit } </span> */}
//                   <img className = "img-slot" src = {fruit} />
                  
//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//         <div className="slot">
//           <section>
//             <div className="container" ref={this.slotRef[1]}>
//               {Slots.defaultProps.fruits.map(fruit => (
//                 <div>
//                   {/* <span>{fruit}</span> */}
//                   <img className = "img-slot" src = {fruit} />

//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//         <div className="slot">
//           <section>
//             <div className="container" ref={this.slotRef[2]}>
//               {Slots.defaultProps.fruits.map(fruit => (
//                 <div>
//                   {/* <span>{fruit}</span> */}
//                   <img className = "img-slot" src = {fruit} />

//                 </div>
//               ))}
//             </div>
//           </section>
//         </div>
//         <div
//           className={!this.state.rolling ? "roll rolling" : "roll"}
//           onClick={!this.state.rolling && this.roll}
//           disabled={this.state.rolling}
//         >
//           {this.state.rolling ? "Rolling..." : "ROLL"}
//         </div>
//       </div>
//     );
//   }
// }

// // ReactDOM.render(<Slots />, document.getElementById('react-root'));
// export default Slots;

// import React       from 'react';
// import SlotMachine from 'react-slot-machine-gen'; // or '../dist/react-slot-machine-gen';

// const reels = [
//   {
//     imageSrc: 'path/to/image.png',
//     symbols: [
//       {
//         title: 'cherry',
//         position: 100,
//         weight: 2
//       },
//       {
//         title: 'plum',
//         position: 300,
//         weight: 6
//       },
//       {
//         title: 'orange',
//         position: 500,
//         weight: 5
//       },
//       {
//         title: 'bell',
//         position: 700,
//         weight: 1
//       },
//       {
//         title: 'cherry',
//         position: 900,
//         weight: 3
//       },
//       {
//         title: 'plum',
//         position: 1100,
//         weight: 5
//       }
//     ]
//   },

//   // add more reels ...
// ]

// class Slots extends React.Component {
//   constructor() {
//     super();

//     this.state = {
//       play: false
//     };
//   }

//   playEvent() {
//     this.setState({
//       play: !this.state.play
//     });
//   }

//   render() {
//     return (
//       <React.Fragment>
//         <SlotMachine reels={reels} play={this.state.play} />
//         <button id="play-button" onClick={() => this.playEvent()}>Play</button>
//       </React.Fragment>
//     );
//   }
// };
// export default Slots;


import React, { useEffect } from 'react';
// import sl1 from '../assets/images/sl1.png' 
// import sl2 from "../assets/images/sl2.png"; 
// import sl3 from "../assets/images/sl3.png"; 
// import sl4 from "../assets/images/sl4.png"; 
const { useRef, useState} = React;

function Slots(props){
  // console.log(props);
  const [fruit1,setFruit1] = useState('/sl1.png');
  const [fruit2,setFruit2] = useState('/sl2.png');
  const [fruit3,setFruit3] = useState('/sl3.png');
  const [rolling,setRolling] = useState(false);
  let slotRef = [useRef(null), useRef(null), useRef(null)];
  const fruits = ["sl1.png","sl2.png","sl3.png","sl4.png"]
  
  // to trigger roolling and maintain state
  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setRolling(false);
    }, 700);

    // looping through all 3 slots to start rolling
    slotRef.forEach((slot, i) => {
      // this will trigger rolling effect
      const selected = triggerSlotRotation(slot.current);
      if(i+1 == 1)
        setFruit1(selected);
      else if(i+1 == 2)
        setFruit2(selected);
      else
        setFruit3(selected);
     });
  };
  
  // this will create a rolling effect and return random selected option
  const triggerSlotRotation = ref => {
    function setTop(top) {
      ref.style.top = `${top}px`;
    }
    let options = ref.children;
    let randomOption = Math.floor(
      Math.random() * fruits.length
    );
    let choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return fruits[randomOption];
  };

  useEffect(()=> {
    if(props.props===true)
      !rolling && roll();
  })

  return (
      <div className="SlotMachine">
        <div className="slot">
          <section>
            <div className="container" ref={slotRef[0]}>
              {fruits.map((fruit, i) => (
                <div key={i}>
                  <img className = "img-slot" src = {fruit} />
                  {/* <span>{fruit}</span> */}
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot">
          <section>
            <div className="container" ref={slotRef[1]}>
              {fruits.map(fruit => (
                <div>
                  <img className = "img-slot" src = {fruit} />
                  {/* <span>{fruit}</span> */}
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot">
          <section>
            <div className="container" ref={slotRef[2]}>
              {fruits.map(fruit => (
                <div>
                  <img className = "img-slot" src = {fruit} />
                  {/* <span>{fruit}</span> */}
                </div>
              ))}
            </div>
          </section>
        </div>
        {/* <div
          className={!rolling ? "roll rolling" : "roll"}
          onClick={!rolling && roll}
          disabled={rolling}>
          {rolling ? "Rolling..." : "ROLL"}
        </div> */}
      </div>
    ); 
};

export default Slots;
