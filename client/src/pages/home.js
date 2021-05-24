
import React from 'react';
import auth from '../auth';
import ItemSummary from './itemsummary';


function Home(props) {



    return (
        <div>


            <button onClick={() => {
                auth.logout(() => {
                    props.history.push('/');
                });
            }}>Log Out</button>

            

            <ItemSummary />
        </div>


    )



}

export default Home;