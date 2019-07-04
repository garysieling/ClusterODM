/**
 *  ClusterODM - A reverse proxy, load balancer and task tracker for NodeODM
 *  Copyright (C) 2018-present MasseranoLabs LLC
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU Affero General Public License as
 *  published by the Free Software Foundation, either version 3 of the
 *  License, or (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU Affero General Public License for more details.
 *
 *  You should have received a copy of the GNU Affero General Public License
 *  along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
"use strict";
const AWS = require('aws-sdk');
const logger = require('./logger');

module.exports = {
    testBucket: async function(accessKey, secretKey, endpoint, bucket){
        return new Promise((resolve, reject) => {
            const config = {
                signatureVersion: 'v4',
                apiVersion: '2006-03-01'
            };

            // If undefined, the AWS SDK will pull from your local profile
            // TODO: take AWS profile names as an argument (this will use "[default]")            
            if (accessKey) {
					  	  config.accessKeyId = accessKey;
            }

            if (secretKey) {
                config.secretAccessKey = secretKey;
            }

            if (endpoint) {
                const spacesEndpoint = new AWS.Endpoint(endpoint);
                config.endpoint = spacesEndpoint;
            }

            console.log(config);
            console.log(process.env);
            const s3 = new AWS.S3(config);

            // Test connection
            s3.putObject({
                Bucket: bucket,
                Key: 'test.txt',
                Body: ''
            }, err => {
                if (!err){
                    logger.info("Can write to S3");
                    resolve(true);
                }else{
                    console.log(err);
                    reject(new Error("Cannot connect to S3. Check your S3 configuration: " + err.code));
                }
            });
        });
    }
};
