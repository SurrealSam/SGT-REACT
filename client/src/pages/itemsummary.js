import React from 'react';
import Axios from 'axios';


class ItemSummary extends React.Component {

    constructor() {
        super();

        this.displayData = [];

        this.state = {
            showdata: this.displayData,
            movements: []
        }

        this.appendData = this.appendData.bind(this);
        this.buildItem = this.buildItem.bind(this);
        this.getItems = this.getItems.bind(this);
        this.getMovements = this.getMovements.bind(this);
        this.getMovementsBySKU = this.getMovementsBySKU.bind(this);

    };

    

    componentDidMount() {
        this.setState({
            movements: this.getMovements()
        })
    }

    buildItem(item) {
        
        let lots = [];
        let uniqueLots = [];
        Axios({
            method: "GET",
            url: `http://localhost:4000/movements/${item.sku}`,
        }).then((res) => {

            
            
             res.data.forEach(movement => {
                 if (movement.lot) {
                     lots.push(movement.lot)
                 }
                
            }); 
            uniqueLots = [...new Set(lots)];
        });
        
        console.log(lots);
        
        console.log(item.sku, uniqueLots);

        const itemDiv =
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{item.sku}</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>

                </div>
            </div>;
        return itemDiv;
    }

    getItems() {

        Axios({
            method: "GET",
            url: "http://localhost:4000/items",
        }).then((res) => {

            console.log(res.data);
            res.data.forEach(item => {

                this.appendData(item);
            });
        });
    };

    getMovements() {
        

        Axios({
            method: "GET",
            url: "http://localhost:4000/movements",
        }).then((res) => {

            console.log(res.data);
            return res.data;
            /* res.data.forEach(item => {
                console.log(item.name);
                this.appendData(item);
            }); */
        });
        
    };

    getMovementsBySKU(sku) {

        Axios({
            method: "GET",
            url: `http://localhost:4000/movements/${sku}`,
        }).then((res) => {

            console.log(res.data);
            return res.data;
            /* res.data.forEach(item => {
                console.log(item.name);
                this.appendData(item);
            }); */
        });
    };

    appendData(item) {
        this.displayData.push(this.buildItem(item));
        this.setState({
            showdata: this.displayData
        });
    }



    render() {
        return (
            <div id="mainContainer">

                <div >
                    <button onClick={this.getItems}>Show Items</button>

                </div>
                <div >
                    <button onClick={this.getMovements}>Log Movements</button>

                </div>
                <div >
                    <button onClick={() => this.getMovementsBySKU("RP10252W")}>Log RP10252W</button>

                </div>
                <div id="display-data-Container">
                    {this.displayData}
                </div>
            </div>
        );
    }
}


export default ItemSummary;