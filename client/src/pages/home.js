
import React from 'react';
import auth from '../auth';

function Home(props) {

    return (
        <div>
            <div>Welcome!</div>

            <button onClick={()=>{
                auth.logout(()=>{
                    props.history.push('/');
                });
            }}>Log Out</button>
        </div>


    )



}

export default Home;