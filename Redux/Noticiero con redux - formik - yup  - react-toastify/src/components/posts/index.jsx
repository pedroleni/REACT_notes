import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router"
import moment from "moment"
import { fetchPostById } from "../../store/utils/thunks"
import { clearPostByID } from "../../store/reducers/posts"

const PostComponent = () => {
    const posts = useSelector((state)=>state.posts);
    const dispatch = useDispatch();
    let param = useParams();

    useEffect(()=>{
        dispatch(fetchPostById(param.id))
    },[])

    useEffect(()=>{
        return()=>{
            dispatch(clearPostByID())
        }
    },[])


    return(
        <>
          { posts.postById ?
            <div className="article_container">
                <h1>{posts.postById.title}</h1>
                <div
                    style={{
                        background:`url(${posts.postById.imagexl})`
                    }}
                    className="image"
                ></div>
                <div className="author">
                    Ceated by: <span>{posts.postById.author} - </span>
                    {moment(posts.postById.createdAt).format('DD MMMM YYYY')}
                </div>
                <div className="mt-3 content">
                   <div
                        dangerouslySetInnerHTML={{
                            __html: posts.postById.content
                        }}
                   ></div>
                </div>
            </div>
            :null}
        </>
    )
}

export default PostComponent