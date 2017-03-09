/**
 * Require priority queue. If it don't work, run 'meteor npm install js-priority-queue'
 * @see https://github.com/adamhooper/js-priority-queue
 * @see http://www.redblobgames.com/grids/hexagons/
 * @type {{pointA: {}, pointB: {}, BS: {}, Result: {success: boolean, message: string, route: null}, FindPath: PathFinder.FindPath}}
 */
PathFinder={

    ResultPF:{
        success:false,
        message:'',
        route:[],
        cost:0
    },
    /**
     * 1-Grass
     * 2-Cover
     * 3-Diff
     * 4-Danger
     * 5-Ruin
     * 0-Unreached
     * -1-Offset
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param BS
     * @constructor
     */
    FindPath:function(x1,y1,x2,y2,BS)
    {
        //reset to default
        this.ResultPF.success=false;
        this.ResultPF.message='';
        this.ResultPF.route=[];
        this.ResultPF.cost=0;
        //end reset to default
        var PriorityQueue=require('js-priority-queue');
        var pointA=new Cell(x1,y1,BS.map[x1][y1].ground);
        var pointB=new Cell(x2,y2,BS.map[x2][y2].ground);
        if(BS.map[x1][y1].ground == 0 || BS.map[x1][y1] == -1)
        {
            this.ResultPF.success=false;
            this.ResultPF.message='Start point Unreached/Offset';
            return this.ResultPF;
        }
        if(BS.map[x2][y2].ground == 0 || BS.map[x2][y2].ground == -1)
        {
            this.ResultPF.success=false;
            this.ResultPF.message='Final point Unreached/Offset';
            return this.ResultPF;
        }
        var frontier=new PriorityQueue({comparator:function(a,b) { return b.cost-a.cost; }});
        var cameFrom={};
        var costSoFar={};

        cameFrom[pointA.toString()]=new Cell(-1,-1,-1);
        costSoFar[pointA.toString()]=0;
        pointA.cost=0;
        frontier.queue(pointA);

        var current;

        while(frontier.length>0)
        {
            current=frontier.dequeue();
            /**
             * Bug with cost fixed, continue must work despite of this is overwork (but right cost)
             */
            if(current.toString() == pointB.toString())//absolute check isn't a decision. Check only coordinate by toString()
            {
                this.ResultPF.success=true;
                this.ResultPF.message='Path was found success';
                continue;//this work, because first arrival can be unsuccesfull
            }

            var neighbors=this.Neighbors(current,BS);
            neighbors.forEach(function(next)
            {
                var newCost=costSoFar[current.toString()]+Cost(current,next);
                if(typeof (costSoFar[next.toString()]) === 'undefined' || newCost<costSoFar[next.toString()])
                {
                    costSoFar[next.toString()]=newCost;
                    next.cost=newCost+Heuristic(pointB,next);
                    frontier.queue(next);
                    cameFrom[next.toString()]=current;
                }
            })
        }
        //write a path. cost without a heuristic part, in path cell with it
        if(this.ResultPF.success)
        {
            current=pointB;
            this.ResultPF.cost=costSoFar[current.toString()];//current.cost-Heuristic(pointA,pointB);
            this.ResultPF.route.push(current);
            while(current.toString() != pointA.toString())
            {
                current=cameFrom[current.toString()];
                this.ResultPF.route.push(current);
            }
            return this.ResultPF;
        }
        else
        {
            this.ResultPF.message='Path didn\'t find';
            return this.ResultPF;
        }
    },
    Neighbors:function(cell,BS)
    {
        var neighbors=[];
        var trying;
        var x=cell.x;
        var y=cell.y;

        this.Shifts.forEach(function(shift)//kill context
        {
            if(!(x+shift.x>=BS.xSize) && !(x+shift.x<0) && !(y+shift.y>=BS.ySize) && !(x+shift.x<0))
            {
                trying=BS.map[x+shift.x][y+shift.y];

                if(trying != undefined && trying != null && trying.ground != -1  && trying.ground != 0)//check offset and unreacheble
                {
                    neighbors.push(new Cell(trying.x,trying.y,trying.ground));
                }
            }
        });
        return neighbors;
    },
    Shifts:[{x:-1,y:0},{x:-1,y:1},{x:0,y:-1},{x:0,y:1},{x:1,y:0},{x:1,y:-1}],
    LOS:function(x1,y1,x2,y2,BS)
    {
        var result={};
        var PriorityQueue=require('js-priority-queue');
        var pointA=new Cell(x1,y1,BS.map[x1][y1].ground);
        var pointB=new Cell(x2,y2,BS.map[x2][y2].ground);
        var frontier=[]
        var cameFrom={};
        cameFrom[pointA.toString()]=new Cell(-1,-1,-1);
        frontier.push(pointA);

        var current;
        while(frontier.length>0)
        {
            current=frontier.pop();

            var neighbors=this.Neighbors(current,BS);
            neighbors.forEach(function(next)
            {
                if(!(next.ground == -1  && !next.toString()==pointB.toString()))//if not offset and not final point
                {
                 if (!cameFrom[next.toString()])
                 {
                     frontier.push(next);
                     cameFrom[next.toString()]=current;
                 }
                }
            })
        }
        current=pointB;
        path=[];
        path.push(current);
        if (!cameFrom[next.toString()])
        {
            result.message='Path isn\'t exist';
            result.path=[];
            return result;
        }
        while (current.toString()!=pointA.toString())
        {
            current=cameFrom[current.toString()];
            path.add(current);
        }
        if (path.length-1==Heuristic(pointB,pointA))
        {
            result.message='Success'
            result.route=path;
            return result;
        }
        else {
            result.message='LOS isn\'t exist';
            result.route=[];
            return result;
        }

    }
};
function Cell(x,y,ground)
{
    this.toString=function()
    {
        return this.x+'_'+this.y;
    }

    this.x=x;
    this.y=y;
    this.ground=ground;
    this.cost=0;
    return this;
};
function Cost(current,next)
{
    switch(next.ground)
    {
        case 1:
        {
            return 1;
        }//grass
        case 2:
        {
            return 10;
        }//cover
        case 3:
        {
            return 50;
        }//diff
        case 4:
        {
            return 100;
        }//danger
        case 5:
        {
            return 200;
        }//ruin
        default:
        {
            return 1000;
        }
    }
};
/**
 * @see http://www.redblobgames.com/grids/hexagons/#conversions
 * used axial system, need to convert in cube
 * also it's just a distance between two point on hex map
 *  (abs(a.q - b.q) + abs(a.q + a.r - b.q - b.r) + abs(a.r - b.r)) / 2
 * @param a
 * @param b
 * @returns {number}
 * @constructor
 */
function Heuristic(a,b)
{
    return (Math.abs(a.x-b.x)+Math.abs(a.x+a.y-b.x-b.y)+Math.abs(b.x-b.y))/2;
};