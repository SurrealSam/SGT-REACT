import React from 'react';
import Axios from 'axios';


class ItemSummary extends React.Component {

    constructor() {
        super();

        this.displayData = [];

        this.state = {
            showdata: this.displayData,
            items: [],
            movements: [],
            testDate: "",
            quantityTotal: 0
        }

        this.appendData = this.appendData.bind(this);
        this.buildItem = this.buildItem.bind(this);
        this.getItems = this.getItems.bind(this);
        this.getMovements = this.getMovements.bind(this);
        this.getMovementsBySKU = this.getMovementsBySKU.bind(this);
        this.isNotExpired = this.isNotExpired.bind(this);
        this.makeDate = this.makeDate.bind(this);
        this.appendLot = this.appendLot.bind(this);
        this.buildLot = this.buildLot.bind(this);
        this.appendTotal = this.appendTotal.bind(this);
        this.buildTotal = this.buildTotal.bind(this);
        this.buildWholeCard = this.buildWholeCard.bind(this);
        this.filterMovements = this.filterMovements.bind(this);

    };



    componentDidMount() {
        this.setState({
            movements: this.getMovements()
        })
        this.getItems()
    }

    buildItem(item) {

        const itemDiv =
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{item.name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">{item.sku}</h6>
                    <p className="card-text"></p>

                </div>
            </div>;
        return itemDiv;
    }

    buildLot(item) {

        let listColor;

        if (item.movement === "receiving") {
            listColor = "list-group-item-primary";
        }
        if (item.movement === "shipping") {
            listColor = "list-group-item-warning";
        }

        const itemDiv =
            <li className={`list-group-item ${listColor}`}>
                <div className="row">
                    <div className="col-md-2 ">{item.movement}</div>
                    <div className="col-md-2">{item.date}</div>
                    <div className="col-md-2">{item.po}</div>
                    <div className="col-md-2">{item.lot}</div>
                    <div className="col-md-2">{item.expiration}</div>
                    <div className="col-md-2">{item.quantity}</div>

                </div>
            </li>;
        return itemDiv;
    }

    filterMovements(sku) {
        var movementArray = [];
        let i;
        for (i = 0; i < this.state.movements.length; i++) {
            if (this.state.movements[i].sku === sku) {
                movementArray.push(this.state.movements[i]);
            }
        }
        console.log(movementArray);
        return movementArray;
    }

    buildWholeCard() {
        this.state.items.forEach(item => {
            let totalQuantity = 0;
            let movementArray = this.filterMovements(item.sku);
            this.appendData(item);

            movementArray.forEach(item => {
                this.appendLot(item);

                if (item.expiration) {
                    if (this.isNotExpired(item.expiration)) {
                        if (item.movement === "shipping") {


                            totalQuantity = totalQuantity - parseInt(item.quantity)



                        }
                        if (item.movement === "receiving") {

                            totalQuantity = totalQuantity + parseInt(item.quantity)

                        }
                    }
                } else {
                    
                    if (item.movement === "shipping") {


                        totalQuantity = totalQuantity - parseInt(item.quantity)



                    }
                    if (item.movement === "receiving") {

                        totalQuantity = totalQuantity + parseInt(item.quantity)

                    }
                }

            })
            this.appendTotal(totalQuantity);
        })

    }


    buildTotal(total) {



        const itemDiv =
            <li>
                <div className="row">
                    <div className="col-md-10 "></div>
                    <div className="col-md-2">Total: {total}</div>

                </div><br></br>
            </li>
            ;
        return itemDiv;
    }

    getItems() {

        Axios({
            method: "GET",
            url: "http://localhost:4000/items",
        }).then((res) => {

            console.log(res.data);
            res.data.forEach(item => {

                this.state.items.push({
                    sku: item.sku,
                    name: item.name
                });

                /* this.appendData(item)
                this.getMovementsBySKU(item.sku) */



            });


        });
    };

    isNotExpired(date) {
        const today = this.makeDate();
        if (date === "") {
            console.log("blank is true")
            return true;
        }
        if (date < today) {

            console.log(date + "is before " + today)
            return false;

        } else if (date > today) {

            console.log(date + " is after " + today)
            return true;

        } else if (date === today) {

            console.log(date + " is the same day as " + today)
            return false;

        } else {

            console.log("expiration cannot be read")
            return;
        }

    }

    getMovements() {


        Axios({
            method: "GET",
            url: "http://localhost:4000/movements",
        }).then((res) => {

            this.setState({
                movements: res.data
            })
        });

    };

    getMovementsBySKU(sku) {

        Axios({
            method: "GET",
            url: `http://localhost:4000/movements/${sku}`,
        }).then((res) => {

            return res.data;

            /* this.setState({
                quantityTotal: 0
            })
            
            console.log(res.data);
    
            
            res.data.forEach(item => {
                console.log(item.name);
                this.appendLot(item);
                
    
                if (item.movement === "shipping") {
    
                    this.setState({
                        quantityTotal: this.state.quantityTotal - parseInt(item.quantity)
                    })
                    
    
                }
                if (item.movement === "receiving") {
    
                    this.setState({
                        quantityTotal: this.state.quantityTotal + parseInt(item.quantity)
                    })
                    
                }
            });
    
            this.appendTotal(this.state.quantityTotal); */
        });
    };

    appendData(item) {
        this.displayData.push(this.buildItem(item));
        this.setState({
            showdata: this.displayData
        });

    }
    appendLot(movement) {
        this.displayData.push(this.buildLot(movement));
        this.setState({
            showdata: this.displayData
        });
    }
    appendTotal(total) {
        this.displayData.push(this.buildTotal(total));
        this.setState({
            showdata: this.displayData
        });
    }

    makeDate() {

        var todayDate = new Date();
        var year = todayDate.getFullYear();
        var month = todayDate.getMonth() + 1;
        var day = todayDate.getDate();


        if (day < 10) {
            day = "0" + day.toString();
        }
        if (month < 10) {
            month = "0" + (month.toString());
        }
        var fullDate = year + "/" + month + "/" + day;
        return fullDate;


    };


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
                    <button onClick={() => this.isNotExpired(this.state.testDate)}>Test Dates</button>

                </div>
                <div >
                    <button onClick={() => this.filterMovements("1814035")}>Filter Movements</button>

                </div>
                <div >
                    <button onClick={() => this.buildWholeCard()}>Build Cards</button>

                </div>
                <div id="display-data-Container">
                    {this.displayData}
                </div>
            </div>
        );
    }
}


export default ItemSummary;