import React from "react"
import sl1 from "../assets/images/sl1.png"; 
import sl2 from "../assets/images/sl2.png"; 
import sl3 from "../assets/images/sl3.png"; 
import sl4 from "../assets/images/sl4.png"; 


const { createRef , Component } = React;












class Slots extends Component {
  static defaultProps = {
    fruits: [sl1,sl2,sl3,sl4]
  };

  constructor(props) {
    super(props);
    this.state = { 
      
      fruit1: sl1, fruit2: sl1, fruit3: sl1, rolling: false
  
  };

    // get ref of dic onn which elements will roll
    this.slotRef = [createRef(), createRef(), createRef()];
  }

  // to trigger roolling and maintain state
  roll = () => {
    this.setState({
      rolling: true
    });
    setTimeout(() => {
      this.setState({ rolling: false });
    }, 700);

    // looping through all 3 slots to start rolling
    this.slotRef.forEach((slot, i) => {
      // this will trigger rolling effect
      const selected = this.triggerSlotRotation(slot.current);
      this.setState({ [`fruit${i + 1}`]: selected });
    });

  };

  // this will create a rolling effect and return random selected option
  triggerSlotRotation = ref => {
    function setTop(top) {
      ref.style.top = `${top}px`;
    }
    let options = ref.children;
    let randomOption = Math.floor(
      Math.random() * Slots.defaultProps.fruits.length
    );
    let choosenOption = options[randomOption];
    setTop(-choosenOption.offsetTop + 2);
    return Slots.defaultProps.fruits[randomOption];
  };

  render() {
    return (
      <div className="SlotMachine">
        <div className="slot">
          <section>
            <div className="container" ref={this.slotRef[0]}>
              {Slots.defaultProps.fruits.map((fruit, i) => (
                <div key={i}>
                  {/* <span>{fruit } </span> */}
                  <img className = "img-slot" src = {fruit} />
                  
                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot">
          <section>
            <div className="container" ref={this.slotRef[1]}>
              {Slots.defaultProps.fruits.map(fruit => (
                <div>
                  {/* <span>{fruit}</span> */}
                  <img className = "img-slot" src = {fruit} />

                </div>
              ))}
            </div>
          </section>
        </div>
        <div className="slot">
          <section>
            <div className="container" ref={this.slotRef[2]}>
              {Slots.defaultProps.fruits.map(fruit => (
                <div>
                  {/* <span>{fruit}</span> */}
                  <img className = "img-slot" src = {fruit} />

                </div>
              ))}
            </div>
          </section>
        </div>
        <div
          className={!this.state.rolling ? "roll rolling" : "roll"}
          onClick={!this.state.rolling && this.roll}
          disabled={this.state.rolling}
        >
          {this.state.rolling ? "Rolling..." : "ROLL"}
        </div>
      </div>
    );
  }
}

// ReactDOM.render(<Slots />, document.getElementById('react-root'));
export default Slots;