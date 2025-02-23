import * as fs from "fs";
import * as lz4 from "lz4";
import * as path from "path";
import * as child_process from "child_process";
const msgpack = require("@msgpack/msgpack"); // Alternatywna biblioteka dla lepszej kompatybilności

// Read the encrypted file
const name = "157100";

fs.readFile(`${name}.rmp.lz4`, (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  // Decompress the file
  const decompressed = lz4.decode(data);

  // Write the decompressed data to a new file
  fs.writeFile(`${name}.rmp`, decompressed, (err) => {
    if (err) {
      console.error("Error writing the file:", err);
      return;
    }

    console.log("File decompressed successfully");

    // Example usage:
    const processor = new MsgpackProcessor();
    processor.processMsgpackFile(`${name}.rmp`);
    processor.saveToJson(`${name}.json`);
  });
});

class MsgpackProcessor {
  constructor() {
    this.blocks = [];
  }

  processMsgpackFile(filename) {
    const fileBuffer = fs.readFileSync(filename);
    const data = msgpack.decode(fileBuffer); // Użycie lepszej biblioteki do dekodowania

    if (Array.isArray(data)) {
      data.forEach((blockData) => this.blocks.push(this._processBlock(blockData)));
    } else {
      this.blocks.push(this._processBlock(data));
    }
  }

  _processBlock(blockData) {
    return this._convertBuffers(blockData);
  }

  _convertBuffers(obj) {
    if (Buffer.isBuffer(obj)) {
      return "0x" + obj.toString("hex"); // Prefiks '0x' typowy dla danych blockchain
    } else if (Array.isArray(obj)) {
      return obj.map((item) => this._convertBuffers(item));
    } else if (obj !== null && typeof obj === "object") {
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return "0x" + Buffer.from(obj.data).toString("hex");
      }
      const newObj = {};
      for (const key in obj) {
        newObj[key] = this._convertBuffers(obj[key]);
      }
      return newObj;
    }
    return obj;
  }

  saveToJson(outputFilename) {
    const outputData = {
      blocks: this.blocks,
      totalBlocks: this.blocks.length,
      totalTransactions: this.blocks.reduce((acc, block) => {
        return acc + (block.transactions ? block.transactions.length : 0);
      }, 0),
    };

    fs.writeFileSync(outputFilename, JSON.stringify(outputData, null, 2));
  }
}

//ls
//aws s3 ls s3://hl-mainnet-evm-blocks/0/111000/112000.rmp.lz4 --request-payer requester --region us-east-1 --recursive --summarize --profile carson

//cp
// aws s3 cp s3://hl-mainnet-evm-blocks/0/111000/112000.rmp.lz4 ./ --request-payer requester --profile carson
