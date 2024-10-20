const express = require('express');
const app = express();
const cors = require('cors');
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello IMDB Movies API');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27017';

const connectDB = async () => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        console.log('MongoDB is now connected.');
        client.close(); // ปิดการเชื่อมต่อหลังจากเชื่อมต่อสำเร็จ
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

connectDB();

// Route สำหรับดึงข้อมูลหนังทั้งหมดที่ถูกจัดอันดับสูงสุด
app.get('/movies', async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const objects = await client.db('mydb').collection('movies_collection')
            .find({})
            .sort({ "IMDB_Rating": -1 })
            .limit(30)
            .toArray();
        res.status(200).send(objects);
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    } finally {
        await client.close();
    }
});

// Route สำหรับสร้างข้อมูลหนังใหม่
app.post('/movies/create', async (req, res) => {
    const movie = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await client.db('mydb').collection('movies_collection').insertOne({
            "Series_Title": movie['Series_Title'],
            "Released_Year": movie['Released_Year'],
            "Genre": movie['Genre'],
            "IMDB_Rating": movie['IMDB_Rating'],
            "Meta_score": movie['Meta_score'],
            "Director": movie['Director'],
            "Created_Date": new Date()
        });
        res.status(200).send({
            "status": "ok",
            "message": "Movie has been created",
            "movie": movie['Series_Title']
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    } finally {
        await client.close();
    }
});


// Route สำหรับอัปเดตข้อมูลหนัง
app.put('/movies/update', async (req, res) => {
    const object = req.body;
    const id = object._id;

    try {
        // ตรวจสอบว่าค่า id เป็น ObjectId ที่ถูกต้องหรือไม่
        if (!ObjectId.isValid(id)) {
            return res.status(400).send({ 'status': "error", 'message': "Invalid ObjectId." });
        }

        const client = new MongoClient(uri);
        await client.connect();

        // ดำเนินการอัปเดตข้อมูล
        const result = await client.db('mydb').collection('movies_collection').updateOne(
            { _id: new ObjectId(id) },  // ใช้ new ObjectId(id) แทน ObjectId(id)
            { $set: {
                "Series_Title": object['Series_Title'],
                "Released_Year": object['Released_Year'],
                "Genre": object['Genre'],
                "IMDB_Rating": object['IMDB_Rating'],
                "Meta_score": object['Meta_score'],
                "Director": object['Director']
            }}
        );

        if (result.modifiedCount === 0) {
            return res.status(404).send({ 'status': "error", 'message': "Movie not found or no changes made." });
        }

        await client.close();

        res.status(200).send({
            'status': "ok",
            'message': "Movie updated successfully for ID: " + id,
            'object': object
        });
    } catch (error) {
        console.error('Error in update route:', error); // เพิ่มการล็อกข้อผิดพลาด
        res.status(500).send({
            'status': "error",
            'message': "Internal server error: " + error.message // เพิ่มข้อมูลข้อผิดพลาด
        });
    }
});

// Route สำหรับลบข้อมูลหนัง
app.delete('/movies/delete', async (req, res) => {
    const id = req.body._id;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        await client.db('mydb').collection('movies_collection').deleteOne({ "_id": ObjectId.createFromHexString(id) });
        res.status(200).send({
            "status": "ok",
            "message": `Movie with ID ${id} has been deleted.`
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    } finally {
        await client.close();
    }
});

app.use(express.json());

//search
app.get('/movies/search/:searchText', async (req, res) => {
    const searchText = req.params.searchText;
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const searchRegex = searchText.split(' ').map(term => ({
            $or: [
                { "Series_Title": { $regex: term, $options: "i" } },
                { "Released_Year": { $regex: term, $options: "i" } },
                { "Genre": { $regex: term, $options: "i" } },
                { "IMDB_Rating": { $regex: term, $options: "i" } },
                { "Meta_score": { $regex: term, $options: "i" } },
                { "Director": { $regex: term, $options: "i" } }
            ]
        }));

        const objects = await client.db('mydb').collection('movies_collection').find({
            $and: searchRegex
        }).sort({ "Created_Date": -1 }).limit(5).toArray();

        res.status(200).send({
            "status": "ok",
            "searchText": searchText,
            "Movies": objects
        });
    } catch (error) {
        res.status(500).send({ status: "error", message: error.message });
    } finally {
        // ทำให้แน่ใจว่า client.close() ถูกเรียกในทุกกรณี
        await client.close();
    }
});

// Route สำหรับดึงข้อมูลหนังตาม ID
app.get('/movies/:id', async (req, res) => {
    const id = req.params.id;
    if (ObjectId.isValid(id)) {
        const client = new MongoClient(uri);
        try {
            await client.connect();
            const movie = await client.db('mydb').collection('movies_collection').findOne({ "_id": ObjectId.createFromHexString(id) });
            if (movie) {
                res.status(200).send({
                    "status": "ok",
                    "ID": id,
                    "Movie": movie
                });
            } else {
                res.status(404).send({ status: "error", message: "Movie not found." });
            }
        } catch (error) {
            res.status(500).send({ status: "error", message: error.message });
        } finally {
            await client.close();
        }
    } else {
        res.status(400).send({ status: "error", message: "Invalid ObjectId." });
    }
});
