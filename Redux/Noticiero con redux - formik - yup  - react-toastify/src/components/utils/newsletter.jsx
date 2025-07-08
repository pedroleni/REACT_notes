import { useRef } from "react";
import { Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify'
import { addToNewsLetter } from "../../store/utils/thunks";
import { clearNewsLetter } from "../../store/reducers/users";

const NewsLetter = () => {
    const textInput = useRef();
    const dispatch = useDispatch();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const value = textInput.current.value;

        if(value === ''){
            toast.error('Empty email',{
                position:'bottom-right'
            });
            return false;
        }

        dispatch(addToNewsLetter({email:value}))
        .unwrap()
        .then( response => {
            
            if(response.newsletter === 'added'){
                toast.success('Thank you !!',{
                    position:'bottom-right'
                });
            }
            if(response.newsletter === 'failed'){
                toast.error('Sorry, already on the DB',{
                    position:'bottom-right'
                });
            }
            textInput.current.value = '';
            dispatch(clearNewsLetter());
        })
    }


   return(
    <div className="newsletter_container">
        <h1>Join our newsletter</h1>
        <div className="form">
            <Form className="mt-4" onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                        type="email"
                        placeholder="youremail@gmail.com"
                        name="email"
                        ref={textInput}
                    />
                </Form.Group>
                <Button className="mt-2" variant="primary" type="submit">
                    Add me to the list
                </Button>
            </Form>
        </div>
    </div>

   )
}

export default NewsLetter;