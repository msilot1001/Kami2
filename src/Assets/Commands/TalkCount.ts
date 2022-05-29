import { Message, MessageEmbed, EmbedFooterData } from 'discord.js';
import logger from '../Utils/Logger.js';
import * as DBManager from '../Database/DBManager.js';
import { getPool } from '../Database/PostgreManager.js';
import EmbedConfig from '../Utils/EmbedConfig.js';

/**
 * 도전과제 함수
 * @param msg 메세지 넘기셈
 * @param Cmdelement 메세지 엘러먼트 넘기셈
 */
async function execute(msg: Message, Cmdelement: string[]) {
  getPool()
    .connect()
    .then(async poolclient => {
      // 데이터 없으면 생성
      await poolclient.query(
        `INSERT INTO talkcount VALUES ('${msg.author.id}',0) ON CONFLICT (userid) DO NOTHING;`,
      );

      // 데이터 조회
      const res2 = await poolclient.query(
        `SELECT * FROM talkcount where userid='${msg.author.id}'`,
      );

      poolclient.release();

      // 임베드 생성
      const footerdata: EmbedFooterData = {
        text: '앞으로도 잘 지내봐요!',
      };

      const embed = new MessageEmbed()
        .setColor(EmbedConfig.color)
        .setTitle(`${msg.author.username}님과 대화한 횟수`)
        .setAuthor(EmbedConfig.author)
        .setDescription(`${res2.rows[0].value}번`)
        .setFooter(footerdata);

      // 답장
      msg.reply({ embeds: [embed] });
    })
    .catch(err => {
      logger.error(`Error: ${err.stack}`);
    });
}

export default execute;