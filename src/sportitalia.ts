import { News } from './Interfaces/INews';
import axios from 'axios';
import dotenv from 'dotenv';
import Telegraf from 'telegraf';
import queryString from 'query-string';

dotenv.config();

export const send = async (): Promise<void> => {
  const apiClient = axios.create({
    baseURL: 'http://newsapi.org/v2/',
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const response = await apiClient.get<News>(
    `top-headlines?  ${queryString.stringify(
      {
        category: 'sport',
        country: 'it',
        pageSize: 5,
        apiKey: process.env.NEWS_API,
      },
      { sort: false },
    )}`,
  );

  const bot = new Telegraf(process.env.BOT_TOKEN);
  const articleToSend = response.data.articles.map((article) =>
    bot.telegram.sendMessage(
      process.env.CHAT_ID,
      `${article.title}: \n ${article.url}`,
    ),
  );
  await Promise.all(articleToSend);
};
