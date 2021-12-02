import React, { Fragment, useState } from 'react'

import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import axios from 'axios'
import { useAlert } from 'react-alert'

const NewProducer = ({ history }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([])
    const [loading, setLoading] = useState(false);

    const alert = useAlert();

    const newProducer = async () => {
        try {

            const formData = new FormData();
            formData.set('name', name);
            formData.set('email', email);
    
            images.forEach(image => {
                formData.append('images', image)
            })
    
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
    
            const { data } = await axios.post(`/api/v1/admin/producer/new`, formData, config)
            await console.log(data);
            await history.push('/admin/producers');
    
        } catch (error) {
            console.log(error)
        }
    }

    // useEffect(() => {

    //     if (error) {
    //         alert.error(error);
    //         dispatch(clearErrors())
    //     }

    //     if (success) {
    //         history.push('/admin/producers');
    //         alert.success('Producer created successfully');
    //         dispatch({ type: NEW_PRODUCT_RESET })
    //     }

    // }, [dispatch, alert, error, success, history])

    const submitHandler = (e) => {
        e.preventDefault();

        newProducer();
    }

    const onChange = e => {

        const files = Array.from(e.target.files)

        setImagesPreview([]);
        setImages([])

        files.forEach(file => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview(oldArray => [...oldArray, reader.result])
                    setImages(oldArray => [...oldArray, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    return (
        <Fragment>
            <MetaData title={'New Producer'} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    <Fragment>
                        <div className="wrapper my-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-4">New Producer</h1>

                                <div className="form-group">
                                    <label htmlFor="name_field">Name</label>
                                    <input
                                        type="text"
                                        id="name_field"
                                        className="form-control"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email_field">Email</label>
                                    <input
                                        type="email"
                                        id="email_field"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>

                                <div className='form-group'>
                                    <label>Images</label>

                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='producer_images'
                                            className='custom-file-input'
                                            id='customFile'
                                            onChange={onChange}
                                            multiple
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose Images
                                     </label>
                                    </div>

                                    {imagesPreview.map(img => (
                                        <img src={img} key={img} alt="Images Preview" className="mt-3 mr-2" width="55" height="52" />
                                    ))}

                                </div>


                                <button
                                    id="login_button"
                                    type="submit"
                                    className="btn btn-block py-3"
                                    disabled={loading ? true : false}
                                >
                                    CREATE
                                </button>

                            </form>
                        </div>
                    </Fragment>
                </div>
            </div>

        </Fragment>
    )
}

export default NewProducer
