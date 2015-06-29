# BitFit
BitFit -- A Fitbit for code. Tracks your git commits and shows them on a page. You pay a certain amount of bitcoin to a specified address every time you go below your target.

# How To Run

1) docker: docker run --env JWT_SECRET=<your_secret_key> --env MONGO_HOST=<your_mongo_ip> -p 49160:8080 -d mnoe11/bit-fit
