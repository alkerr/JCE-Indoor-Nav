# check the prototype
https://htmlpreview.github.io/?https://github.com/alkerr/JCE-Indoor-Nav/blob/master/routing-service/index.html


this prototype demonstrates the functionality of the routing service which uses dijkstra's algorithem

# Explantaion 
first we will have a graph that will represent the waypoints in the college (the places where we can walk), we will pass this graph to this service with a start and an end point, the service will return an array of the waypoint(nodes) that the user needs to take to go from the start to the finish. these point will be returned to the navigation service, which will draw them on the screen above the map layer.
