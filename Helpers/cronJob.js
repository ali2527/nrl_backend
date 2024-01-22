const cron = require('node-cron');
const axios = require('axios');
const News = require('../Models/News');
const History = require('../Models/History');


const newsChannelIds = ['UCHGQhpOhVC5XbqWfv-LQ5XA','UCrW29qlb7nE-1lTgs530t6g'];
const historyChannelIds = ['UCY3e2N8Z9osGTSruYtD-ZsA'];

cron.schedule('1 0 * * *', async () => {
    console.log('Cron job run');

    try {
        // Fetch videos from multiple channels
        const allNews = [];
        const allHistories = [];

        for (const channelId of newsChannelIds) {
            const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    channelId: channelId,
                    maxResults: 10,
                    type: 'video',
                    key: 'AIzaSyBgRXJrw-N3_MgEOaSdcejfWbhrCuzvGug',
                },
            });

            const videos = videoResponse.data.items.map((item) => ({
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.default.url,
                channel: item.snippet.channelTitle,
                date: item.snippet.publishedAt,
                videoID: item.id.videoId,
            }));

            allNews.push(...videos);
        }

        for (const channelId of historyChannelIds) {
            const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
                params: {
                    part: 'snippet',
                    channelId: channelId,
                    maxResults: 10,
                    type: 'video',
                    key: 'AIzaSyBgRXJrw-N3_MgEOaSdcejfWbhrCuzvGug',
                },
            });

            const videos = videoResponse.data.items.map((item) => ({
                title: item.snippet.title,
                description: item.snippet.description,
                thumbnail: item.snippet.thumbnails.default.url,
                channel: item.snippet.channelTitle,
                date: item.snippet.publishedAt,
                videoID: item.id.videoId,
            }));

            allHistories.push(...videos);
        }

        // Combine videos from multiple channels into one array
        const combinedNews = allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        const combinedHistories = allHistories.sort((a, b) => new Date(b.date) - new Date(a.date));


        // Save the combined and sorted data to the MongoDB database using Mongoose
        await News.deleteMany({}); // Remove existing data (use with caution)

        await News.insertMany(combinedNews);

        await History.deleteMany({}); // Remove existing data (use with caution)

        await History.insertMany(combinedHistories);

        

        console.log('Data saved to MongoDB');
    } catch (error) {
        console.error('Error:', error);
    }
});
