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

    /* buildLot(item) {

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
    } */

    filterMovements(sku) {
        var movementArray = [];
        let i;
        for (i = 0; i < this.state.movements.length; i++) {
            if (this.state.movements[i].sku === sku) {
                movementArray.push(this.state.movements[i]);
            }
        }
        
        return movementArray;
    }

    buildWholeCard() {
        this.state.items.forEach(item => {
            let totalQuantity = 0;
            let movementArray = this.filterMovements(item.sku);
            this.appendData(item);
            let lots = [];

            movementArray.forEach(item => {
                /* this.appendLot(item); */
                lots.push(item.lot);

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
            let uniqueLots = [...new Set(lots)];
            let builtLots = [];
            uniqueLots.forEach(lot => {

                builtLots.push({
                    lot: lot,
                    quantity: 0,
                    expiration: '',
                    isNotExpired: true
                })

            })
            
            movementArray.forEach(movement => {

                let i;
                for (i = 0; i < builtLots.length; i++) {
                    if (movement.lot === builtLots[i].lot) {

                        if (movement.movement === "shipping") {

                            builtLots[i].quantity = builtLots[i].quantity - parseInt(movement.quantity);

                        }
                        if (movement.movement === "receiving") {

                            builtLots[i].quantity = builtLots[i].quantity + parseInt(movement.quantity);

                        }
                        if (movement.expiration) {

                            builtLots[i].isNotExpired = this.isNotExpired(movement.expiration);
                            builtLots[i].expiration = movement.expiration;

                        }
                    };
                }
            })
            
            builtLots.forEach(lot =>{
                this.appendLot(lot);
            })
            this.appendTotal(totalQuantity);
        })

    }

    buildLot(lot) {

        let listColor;

        if (lot.isNotExpired) {
            listColor = "list-group-item-success";
        }
        else {
            listColor = "list-group-item-danger"
        }

        const itemDiv =
            <li className={`list-group-item ${listColor}`}>
                <div className="row">
                    
                    <div className="col-md-2">Lot: {lot.lot}</div>
                    <div className="col-md-2">Expiration Date: {lot.expiration}</div>
                    <div className="col-md-2">Quantity: {lot.quantity}</div>
                    <div className="col-md-6 "></div>

                </div><br></br>
            </li>
            ;
        return itemDiv;
    }


    buildTotal(total) {



        const itemDiv =
            <li>
                <div className="row">
                    <div className="col-md-4 "></div>
                    <div className="col-md-2">Total: {total}</div>
                    <div className="col-md-6 "></div>

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

            
            res.data.forEach(item => {

                this.state.items.push({
                    sku: item.sku,
                    name: item.name
                });
            });
        });
    };

    isNotExpired(date) {
        const today = this.makeDate();
        if (date === "") {
            
            return true;
        }
        if (date < today) {

            
            return false;

        } else if (date > today) {

            
            return true;

        } else if (date === today) {

            
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
                    <button onClick={() => this.buildWholeCard()}>View Summary</button>

                </div>
                <div id="display-data-Container">
                    {this.displayData}
                </div>
            </div>
        );
    }
}


export default ItemSummary;