import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { MDBDataTable } from 'mdbreact'


import axios from 'axios';
import MetaData from '../layout/MetaData'
import Loader from '../layout/Loader'
import Sidebar from './Sidebar'

import { useAlert } from 'react-alert'

const ProducersList = ({ history }) => {

    const [producers, setAllProducers] = useState([]);
    const [loading, setLoading] = useState(false);
    const alert = useAlert();
    
    
    const getProducers = async ()=>{
        try {

            let link = `/api/v1/producers`
    
            const { data } = await axios.get(link)
            setAllProducers(data.producers)
    
        } catch (error) {
            console.log(error);
        }
    }

    getProducers();

    // useEffect(() => {

    //     if (error) {
    //         alert.error(error);
    //     }

    //     if (deleteError) {
    //         alert.error(deleteError);
    //     }

    //     if (isDeleted) {
    //         alert.success('Producer deleted successfully');
    //         history.push('/admin/producers');
    //     }

    // }, [dispatch, alert, error, deleteError, isDeleted, history])

    const setProducers = () => {
        const data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc'
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc'
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: []
        }

        producers.forEach(producer => {
            data.rows.push({
                id: producer._id,
                name: producer.name,
                email: producer.email,
                actions: <Fragment>
                    <Link to={`/admin/producer/${producer._id}`} className="btn btn-primary py-1 px-2">
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => deleteProducerHandler(producer._id)}>
                        <i className="fa fa-trash"></i>
                    </button>
                </Fragment>
            })
        })

        return data;
    }

    const deleteProducerHandler = (id) => {
    }

    return (
        <Fragment>
            <MetaData title={'All Producers'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Producers</h1>

                        {loading ? <Loader /> : (
                            <MDBDataTable
                                data={setProducers()}
                                className="px-3"
                                bordered
                                striped
                                hover
                            />
                        )}

                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default ProducersList
