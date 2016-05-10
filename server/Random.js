/**
 * Created by Alecxandrys on 08.05.2016.
 */

Meteor.methods({

    "call test":function()
        {
            FullRandomSignature(10,2,2,3,3,6);
        },
    "call test2":function()
        {
            OptimalSignature(10,4,4,3,3,1);
        }
});


test=function(count,shoot,hit,penetrate,wound,afterEffect)
    {
        var result={};
      //  console.time('testFullRandomSignature');
        result.test1=FullRandomSignature(count,shoot,hit,penetrate,wound,afterEffect);
       // console.timeEnd('testFullRandomSignature');
        shoot=6-shoot;
        hit=6-hit;
        penetrate=6-penetrate;
        wound=6-wound;
        afterEffect=6-afterEffect;
      //  console.time('testOptimalSignature');
        result.test2=OptimalSignature(count,shoot,hit,penetrate,wound,afterEffect);
      //  console.timeEnd('testOptimalSignature');
        return result;
    };
 test2 =function()
    {
       // console.time('Create');
        var m = new MersenneTwister();
       // console.timeEnd('Create');
       //console.time('Create1');
        var randomNumber = m.random();
      //  console.timeEnd('Create1');
        console.log(randomNumber);
        //console.time('Create2');
        randomNumber = m.random();
       // console.timeEnd('Create2');
        console.log(randomNumber);
    };
/**
 * @return {{}}
 */
var FullRandomSignature=function(count,shoot,hit,penetrate,wound,afterEffect){

    new SimpleSchema({
        count:{type:Number},
        shoot:{type:Number,min:1,max:6},
        hit:{type:Number,min:2,max:6},
        penetrate:{type:Number,min:2,max:6},
        wound:{type:Number,min:1,max:6},
        afterEffect:{type:Number,min:1,max:6}
    }).validate({count:count,shoot:shoot,hit:hit,penetrate:penetrate,wound:wound,afterEffect:afterEffect});

    var result={};
    var success=0;
    var x;

    if (shoot!=1)
        {
            for (var i=0;i<count;i++)
                {
                    //Math.floor(Math.random() * (max - min + 1)) + min
                    x=Math.floor(Math.random() * (6 - 1 + 1)) + 1;
                    if (x>=shoot)
                        {success++}
                }
            count=success;
            success=0;
        }
    for (i=0;i<count;i++)
        {
            x=Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            if (x>=hit)
                {success++}
        }
    count=success;
    success=0;
    for (i=0;i<count;i++)
        {
            x=Math.floor(Math.random() * (6 - 1 + 1)) + 1;
            if (x>=penetrate)
                {success++}
        }

    if (wound!=1)
        {
            count=success;
            success=0;
            for(i = 0; i < count; i++)
                {
                    x = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
                    if(x >= wound)
                        {success++}
                }
        }
    result.success=success;
    if (afterEffect!=1)
        {
            count = success;
            success = 0;
            for(i = 0; i < count; i++)
                {

                    x = Math.floor(Math.random() * (6 - 1 + 1)) + 1;
                    if(x >= afterEffect)
                        {success++}
                }
        }
    result.afterEffect=success;
    console.log(result);
    return result;
};

var OptimalSignature=function(count,shoot,hit,penetrate,wound,afterEffect){
    //5%2-mod
    //5/2|0-div

    new SimpleSchema({
        count:{type:Number},
        shoot:{type:Number,min:0,max:5},
        hit:{type:Number,min:0,max:4},
        penetrate:{type:Number,min:0,max:4},
        wound:{type:Number,min:0,max:5},
        afterEffect:{type:Number,min:0,max:5}
    }).validate({count:count,shoot:shoot,hit:hit,penetrate:penetrate,wound:wound,afterEffect:afterEffect});

    var result={};
    var del;
    var x=Math.floor(Math.random()*199999-100000+1)+100000;

    //y=15x - (x/5)*5*(x-4) - (x/8)*5*(x-7)
    //0 15 30 45 60 70 80 90 95 100
    if (shoot!=5)
        {
            del=x%10%5+shoot;
            count=count*((15*del - (del/5|0)*5*(del-4) - (del/8|0)*5*(del-7))/100);
            x=x/10|0;
        }

    //hit
    del=x%10%5+hit;
    count=count*((15*del - (del/5|0)*5*(del-4) - (del/8|0)*5*(del-7))/100);
    x=x/10|0;
    //penetrate
    del=x%10%5+penetrate;
    count=count*((15*del - (del/5|0)*5*(del-4) - (del/8|0)*5*(del-7))/100);
    x=x/10|0;

    if (wound!=5)
        {
            del=x%10%5+wound;
            count=count*((15*del - (del/5|0)*5*(del-4) - (del/8|0)*5*(del-7))/100);
            x=x/10|0;
        }
    result.success=Math.floor(count);
    if (afterEffect!=5)
        {
            del=x%10%5+afterEffect;
            count=count*((15*del - (del/5|0)*5*(del-4) - (del/8|0)*5*(del-7))/100);
        }
    result.afterEffect=Math.floor(count);
    console.log(result);
    return result;
};

var MersenneTwister = function(seed) {
    if (seed == undefined) {
        seed = new Date().getTime();
    }
    /* Period parameters */
    this.N = 624;
    this.M = 397;
    this.MATRIX_A = 0x9908b0df;   /* constant vector a */
    this.UPPER_MASK = 0x80000000; /* most significant w-r bits */
    this.LOWER_MASK = 0x7fffffff; /* least significant r bits */

    this.mt = new Array(this.N); /* the array for the state vector */
    this.mti=this.N+1; /* mti==N+1 means mt[N] is not initialized */

    this.init_genrand(seed);
};


//https://gist.github.com/banksean/300494

/* initializes mt[N] with a seed */
MersenneTwister.prototype.init_genrand = function(s) {
    this.mt[0] = s >>> 0;
    for (this.mti=1; this.mti<this.N; this.mti++) {
        var s = this.mt[this.mti-1] ^ (this.mt[this.mti-1] >>> 30);
        this.mt[this.mti] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253)
            + this.mti;
        /* See Knuth TAOCP Vol2. 3rd Ed. P.106 for multiplier. */
        /* In the previous versions, MSBs of the seed affect   */
        /* only MSBs of the array mt[].                        */
        /* 2002/01/09 modified by Makoto Matsumoto             */
        this.mt[this.mti] >>>= 0;
        /* for >32 bit machines */
    }
};

/* initialize by an array with array-length */
/* init_key is the array for initializing keys */
/* key_length is its length */
/* slight change for C++, 2004/2/26 */
MersenneTwister.prototype.init_by_array = function(init_key, key_length) {
    var i, j, k;
    this.init_genrand(19650218);
    i=1; j=0;
    k = (this.N>key_length ? this.N : key_length);
    for (; k; k--) {
        var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30)
        this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1664525) << 16) + ((s & 0x0000ffff) * 1664525)))
            + init_key[j] + j; /* non linear */
        this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
        i++; j++;
        if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
        if (j>=key_length) j=0;
    }
    for (k=this.N-1; k; k--) {
        var s = this.mt[i-1] ^ (this.mt[i-1] >>> 30);
        this.mt[i] = (this.mt[i] ^ (((((s & 0xffff0000) >>> 16) * 1566083941) << 16) + (s & 0x0000ffff) * 1566083941))
            - i; /* non linear */
        this.mt[i] >>>= 0; /* for WORDSIZE > 32 machines */
        i++;
        if (i>=this.N) { this.mt[0] = this.mt[this.N-1]; i=1; }
    }

    this.mt[0] = 0x80000000; /* MSB is 1; assuring non-zero initial array */
};

/* generates a random number on [0,0xffffffff]-interval */
MersenneTwister.prototype.genrand_int32 = function() {
    var y;
    var mag01 = new Array(0x0, this.MATRIX_A);
    /* mag01[x] = x * MATRIX_A  for x=0,1 */

    if (this.mti >= this.N) { /* generate N words at one time */
        var kk;

        if (this.mti == this.N+1)   /* if init_genrand() has not been called, */
            this.init_genrand(5489); /* a default initial seed is used */

        for (kk=0;kk<this.N-this.M;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+this.M] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        for (;kk<this.N-1;kk++) {
            y = (this.mt[kk]&this.UPPER_MASK)|(this.mt[kk+1]&this.LOWER_MASK);
            this.mt[kk] = this.mt[kk+(this.M-this.N)] ^ (y >>> 1) ^ mag01[y & 0x1];
        }
        y = (this.mt[this.N-1]&this.UPPER_MASK)|(this.mt[0]&this.LOWER_MASK);
        this.mt[this.N-1] = this.mt[this.M-1] ^ (y >>> 1) ^ mag01[y & 0x1];

        this.mti = 0;
    }

    y = this.mt[this.mti++];

    /* Tempering */
    y ^= (y >>> 11);
    y ^= (y << 7) & 0x9d2c5680;
    y ^= (y << 15) & 0xefc60000;
    y ^= (y >>> 18);

    return y >>> 0;
};

/* generates a random number on [0,0x7fffffff]-interval */
MersenneTwister.prototype.genrand_int31 = function() {
    return (this.genrand_int32()>>>1);
};

/* generates a random number on [0,1]-real-interval */
MersenneTwister.prototype.genrand_real1 = function() {
    return this.genrand_int32()*(1.0/4294967295.0);
    /* divided by 2^32-1 */
};

/* generates a random number on [0,1)-real-interval */
MersenneTwister.prototype.random = function() {
    return this.genrand_int32()*(1.0/4294967296.0);
    /* divided by 2^32 */
};

/* generates a random number on (0,1)-real-interval */
MersenneTwister.prototype.genrand_real3 = function() {
    return (this.genrand_int32() + 0.5)*(1.0/4294967296.0);
    /* divided by 2^32 */
};

/* generates a random number on [0,1) with 53-bit resolution*/
MersenneTwister.prototype.genrand_res53 = function() {
    var a=this.genrand_int32()>>>5, b=this.genrand_int32()>>>6;
    return(a*67108864.0+b)*(1.0/9007199254740992.0);
};