This set of examples relies on the commonly-found *curl* tool and *jq* for JSON handling. You can find *jq* here:
[jq](http://stedolan.github.io/jq/)

1. Authorization token
---

To make all other API requests, first retrieve your OAuth2.0 Bearer token. 

_Replace `myApikey` and `mySecret` with the API Key and Secret from your account page._

_Note: the initial user created in with your account will be named `admin`._

```sh
curl https://apis.voicebase.com/v2-beta/access/users/admin/tokens \
    --user myApikey:mySecret \
    > get-tokens-response.json
export TOKEN=$( jq --raw-output '.tokens | .[0] | .token' < get-tokens-response.json )
echo "Token:" ${TOKEN}
```

2. Upload a media file
---

Next, upload a media file to VoiceBase for analysis. Media files reside under the `/media/` collection. 

To upload, make a `form/mime-multipart` `POST` to the `/media/` collection.

_Replace `recoding.mp4` in the example with a path to the file to analyze._

```sh
curl https://apis.voicebase.com/v2-beta/media \
    --header "Authorization: Bearer $TOKEN" \
    --form media=@recording.mp4 \
    > media-post-response.json
     
export MEDIA_ID=$( jq --raw-output '.mediaId' < media-post-response.json )
echo "Uploaded file with mediaId = ${MEDIA_ID}"
```

Each uploaded media file will have a unique `mediaId` for future reference.

3. Check processing status
---

Check the status of processing for the media by `GET`ting its corresponding item in the `/media/` collection.

```sh
curl https://apis.voicebase.com/v2-beta/media/${MEDIA_ID} 
    --header "Authorization: Bearer $TOKEN" \
    > media-get-response.json
export STATUS=$( jq --raw-output '.status' < media-get-response.json )
echo "Status at" $( date ) "is" "${STATUS}"
```

A common pattern is to wait until VoiceBase's processing of the media is complete before. 

To get started, poll periodically for status of the media until processing is complete (`finished` or `failed`).

_Note: We will later look at how to use If-Modified-Since or HTTP[S] callbacks to accomplish this more efficiently._

```sh
until [[ ${STATUS} == 'finished' || ${STATUS} == 'failed' ]]; do
    curl https://apis.voicebase.com/v2-beta/media/${MEDIA_ID} \
        --header "Authorization: Bearer $TOKEN" \
        > media-get-response.json
    export STATUS=$( jq --raw-output '.status' < media-get-response.json )
    echo "Status at" $( date ) "is" "${STATUS}"
done
```

4. Get transcript, keywords, and topics
---

Retrieve the transcript by `GET`ting the `/transcripts/latest` resource under the media item. 

```sh
curl https://apis.voicebase.com/v2-beta/media/${MEDIA_ID}/transcripts/latest \
    --header "Authorization: Bearer $TOKEN" \
    > media-get-transcript.json
jq '.transcript.words' < media-get-transcript.json
```

Retrieve the keywords by `GET`ting the `/keywords/latest` resource under the media item. 

```sh
curl https://apis.voicebase.com/v2-beta/media/${MEDIA_ID}/keywords/latest \
    --header "Authorization: Bearer $TOKEN" \
    > media-get-keywords.json
jq '.keywords.words' < media-get-keywords.json
```

Retrieve the topics by `GET`ting the `/topics/latest` resource under the media item. 

```sh
curl https://apis.voicebase.com/v2-beta/media/${MEDIA_ID}/topics/latest \
    --header "Authorization: Bearer $TOKEN" \
    > media-get-topics.json
jq '.topics.terms' < media-get-topics.json
```

Or, alternately, retrieve all three by `GET`ting the `/media/` item with the `include` option.
```sh
curl "https://apis.voicebase.com/v2-beta/media/${MEDIA_ID}?include=transcripts&include=keywords&include=topics" \
    --header "Authorization: Bearer $TOKEN" \
    > media-get-all.json
```