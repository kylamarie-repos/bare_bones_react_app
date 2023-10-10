import { useState, useEffect } from "react";
import { db } from "./fbconfig";
import {addDoc, collection, doc, getDocs, deleteDoc, updateDoc} from "firebase/firestore";
import { storage } from "./fbconfig";
import { ref, getDownloadURL, uploadBytesResumable } from "@firebase/storage";


export default function CRUD()
{
    const [dataName, setDataName] = useState("");
    const [dataDescription, setDataDescription] = useState("");
    const [dataContainment, setDataContainment] = useState("");

    const [readData, setReadData] = useState([]);

    const[id, setId] = useState("");
    const[showDoc, setShowDoc] = useState(false);

    const [image, setImage] = useState(null);
    const [imageURL, setImageURL] = useState("");

    const OurCollection = collection(db, "data");

    useEffect(() => {
        const getData = async () => 
        {
            const ourDocsToRead = await getDocs(OurCollection);
            setReadData(
                ourDocsToRead.docs.map(
                    doc=>({...doc.data(), id:doc.id})
                )
            );
        }
        getData()
    }, []);

    const crudCreate = async () => {
        await addDoc(OurCollection, {Name:dataName, Description:dataDescription, Containment:dataContainment, imageURL:imageURL});
    }

    const crudDelete = async (id) => {
        const docToDelete = doc(db, "data", id);
        await deleteDoc(docToDelete);
    }

    const showEdit = async (id, Name, Description, Containment) => {
        setDataName(Name);
        setDataDescription(Description);
        setDataContainment(Containment);
        setImageURL(imageURL);
        setId(id);
        setShowDoc(true);
    }

    const crudUpdate = async () => {
        const updateData = doc(db, "data", id);
        await updateDoc(updateData, {Name:dataName, Description:dataDescription, Containment:dataContainment, imageURL:imageURL});
        setShowDoc(false);
        setDataName("");
        setDataDescription("");
        setDataContainment("");
    }

    const handleImageChange = (e) => {
        if(e.target.files[0])
        {
            setImage(e.target.files[0]);
        }
    }

    const uploadImage = async () => {
        const storageRef = ref(storage, "images/" + image.name);
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on("state_changed",
            // progress function
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log("Upload " + progress + "% done.");
            },
            //error function
            (error) => {console.log(error)},
            // complete upload retrieve URL to upload image
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                setImageURL(downloadURL);
            }
        );
    }

    return (
        <>
        <input value={dataName} onChange={(Name) => setDataName(Name.target.value)} placeholder="Name"/>
        <br />
        <br />
        <input value={dataDescription} onChange={(Description) => setDataDescription(Description.target.value)} placeholder="Description"/>
        <br />
        <br />
        <input value={dataContainment} onChange={(Containment) => setDataContainment(Containment.target.value)} placeholder="Containment"/>
        <br />
        <br />
        <input type="file" onChange={handleImageChange} />
        {" "}
        <button onClick={uploadImage}>Upload Image</button>
        <br />
        {imageURL ** <img src={imageURL} alt="Uploaded Preview" style={{maxWidth: "200px", height: "auto"}} /> }
        <br />
        <br />
        {!showDoc?<button onClick={crudCreate}>Create new document</button>:
        <button onClick={crudUpdate}>Update Document</button>}

        <hr />
        {
            readData.map(
                values => (
                    <div key={values.id}>
                        <h1>{values.Name}</h1>
                        <p><strong>Description: </strong>{values.Description}</p>
                        <p><strong>Containment: </strong>{values.Containment}</p>
                        <p>{values.imageURL && <img src={values.imageURL} alt={values.imageURL} style={{maxWidth: "200px", height: "auto"}} />}</p>
                        <button onClick={()=>crudDelete(values.id)}>Delete</button>
                        {' '}
                        <button onClick={()=>showEdit(values.id, values.Name, values.Description, values.Containment, values.imageURL)}>Edit</button>
                    </div>
                )
            )
        }
        </>
    )
}

