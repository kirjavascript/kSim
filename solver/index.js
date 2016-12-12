import solver from 'worker-loader?inline=only!./worker';

window.work = function() {

    let worker = new solver();

    worker.onmessage = function(e) {
        console.log(e.data);
    };


};

// 01:03 <+justinjaffray> Kirjava: what's the benefit to doing the string conversion? just easier?
// 01:04 <+justinjaffray> I suspect it would be significantly worse over time tbh
// 01:04 <+justinjaffray> because it generates garbage and looping through douesn't
// 01:04 <+justinjaffray> but yeah you'd probably have to profile to see how much worse
// 01:10 <+Kirjava> eyah just easier than comparing nested arrays
// 01:11 <+Kirjava> also I realised I have to create a new object for each position, this is gonna generate a lot of garbage too I guess
// 01:12 <+justinjaffray> yeah I think it's v worth reusing the structures when you can
// 01:13 <+Kirjava> not really sure how. since I'm using recursion to traverse the tree, mutating a single object will just produce an invalid cubestate?
// 01:14 <+justinjaffray> the way LLA is works is that it just has an array of cubestates that's the max depth of the search tree
// 01:14 <+justinjaffray> and it reuses those same ones
// 01:14 <+justinjaffray> it's definitely a little more complex because of the mutation though
// 01:14 <+justinjaffray> so it's a tradeoff
// 01:14 <+Kirjava> so you have to revert the position
// 01:15 <+Kirjava> somehow
// 01:15 <+justinjaffray> nah well because of the way the traversal works
// 01:15 <+justinjaffray> it only depends on the one right before it
// 01:15 <+justinjaffray> so it's like a stack and we go up and down it
// 01:15 -!- supercavitation [~supercavi@206.196.185.127] has joined #rubik
// 01:15 -!- supercavitation [~supercavi@206.196.185.127] has quit [Client Quit]
// 01:16 <+Kirjava> when you go down, you have to undo the original move and reapply your next move though, right?
// 01:16 <+justinjaffray> oh in theory yeah, but in reality the cube one level up on the stack is the same one but with the move undone
// 01:16 <+Kirjava> oh yeah!
// 01:17 <+Kirjava> this is.. DFS, right?
// 01:18 <+justinjaffray> yeah
// 01:18 <+justinjaffray> iterated deepening DFS
// 01:18 <+justinjaffray> or w/e the term is
// 01:18 <+Kirjava> yeah
// 01:18 <+justinjaffray> where it just does DFS up to an increasing limit
// 01:18 <+Kirjava> I've been reading jaap's page a lot
// 01:18 <+justinjaffray> which is nice in this case because it means it can reconstruct the search tree for the next algorithm by just remember the last one it tweeted
// 01:18 <+justinjaffray> *remembering
// 01:18 <+Kirjava> still don't feel grok stuff but ~_~
// 01:19 <+Kirjava> oh, neat
// 01:21 <+Kirjava> I'm quite interested to see how well this can be done client side

// 16:19 <Kirjava> I have a few questions still if I can pick your brain
// 16:19 <Kirjava> 1) doesn't iterative deepening cause to you check solutions multiple times
// 16:21 <Kirjava> 2) if you use a pruning table to omit cases that use < x moves, don't you need to compute those positions anyway?
// 17:56 <justinjaffray> 1) I only do the check at the bottom of the tree, so each position is only ever actually *checked* once, but it's true that we visit certain positions multiple times
// 17:57 <justinjaffray> 2) you need to compute some, but the idea is that you cut off entire subtrees, so if you're 4 moves away from solved, and you know that some subpart of the puzzle needs 5 moves, you don't need to check *anything* 
//                       under that node
// 17:57 <justinjaffray> you can just cut it off early
// 18:06 <Kirjava> *4 moves away from max depth?
// 18:07 <Kirjava> oh, so you only check when depth left is 0
// 18:07 <Kirjava> fukin 'A









