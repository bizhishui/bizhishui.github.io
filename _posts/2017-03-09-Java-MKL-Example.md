---
title: Java MKL Simple Example
layout: post
guid: urn:uuid:8fa2648e-e659-4efc-9951-b489aa5d4047
categories:
  - notes
tags:
  - java
  - MKL
---

> This post note how to call Intel MKL method from java.


* TOC
{:toc}

---

### Preparations
First we need make sure the Java Developpement Kit (JDK) and Intel MKL are well installed.
Suppose jdk is installed under the path */opt/jdk/jdk1.8.0_121*. As java use JNI (Java Native Interface)
to call c/c++ function, we can create soft links for the corresponding header files with:

```
    ln -s /opt/jdk/jdk1.8.0_121/include/jni.h ~/usr/include     
    ln -s /opt/jdk/jdk1.8.0_121/include/linux/jni_md.h ~/usr/include
```

The Intel MKL libaray is included in Intel Parallel Studio (for linux)  which provides a very friendly GUI for installation.
But make sure to use the following commands to set the PATH related varibales.

```
    source /usr/intel/bin/compilervars.sh intel64   #or 
    source /usr/intel/compilers_and_libraries/linux/mkl/bin/mklvars.sh intel64   #/usr/intel is the installation directory
```

### Simple Example Run on Command-line
This section is mainly adapted from [Intel Developer Zone](https://software.intel.com/en-us/articles/performance-tools-for-software-developers-how-do-i-use-intel-mkl-with-java).
Intel® MKL C functions can be accessed from Java through Java Native Interface (JNI). The following example shows how to call cblas_dgemm from java on Linux.

#### 1. Create a java file with cblas dgemm description (CBLAS.java)
{:.no_toc}

```
    /*CBLAS.java*/
    public final class CBLAS {
     private CBLAS() {}
     static {
     System.loadLibrary("mkl_java_stubs"); /*load library (which will contain wrapper for cblas function. See step 3)*/
     }
     public final static class ORDER {
       private ORDER() {}
      /** row-major arrays */
       public final static int RowMajor=101;
       /** column-major arrays */
       public final static int ColMajor=102;
     }
    public final static class TRANSPOSE {
      private TRANSPOSE() {}
        /** trans='N' */
       public final static int NoTrans =111;
       /** trans='T' */
       public final static int Trans=112;
       /** trans='C' */
       public final static int ConjTrans=113;
     }
    public static native void dgemm(int Order, int TransA, int TransB, int M, int N, int K, double alpha, double[] A, int lda, double[] B, int ldb, double beta, double[] C, int ldc); /*inform java virtual machine that function is defined externally*/
}
```

Compile the CBLAS.java using the java compiler as below:

```
    javac CBLAS.java
```

#### 2. Generate headers files from the java class file which was created in the previous step
{:.no_toc}
These headers should be used in C file in the next step. You donot need edit the generated header file *CBLAS.h*.

```
    javah -classpath . CBLAS      #javah -classpath path_to_jars_or_classes com.my.package.MyClass
```

#### 3. Use definition of Java_CBLAS_dgemm in header CBLAS.h that was generated in step 2 to write C file CBLAS.c
{:.no_toc}
Definition of function Java_CBLAS_dgemm should be used in wrapper for MKL. Create C file CBLAS.c

```
    /*CBLAS.c*/
    #include <jni.h>
    #include <assert.h>
    #include "mkl_cblas.h"
    
    JNIEXPORT void Java_CBLAS_dgemm (JNIEnv *env, jclass klass,    jint Order, jint TransA, jint TransB, jint M, jint N, jint K,   jdouble alpha, jdoubleArray  A, int lda, jdoubleArray B, jint ldb,  jdouble beta,  jdoubleArray C, jint ldc){
        jdouble *aElems, *bElems, *cElems;
     
        aElems = (*env)-> GetDoubleArrayElements (env,A,NULL);
        bElems = (*env)-> GetDoubleArrayElements (env,B,NULL);
        cElems = (*env)-> GetDoubleArrayElements (env,C,NULL);
        assert(aElems && bElems && cElems);
     
    cblas_dgemm ((CBLAS_ORDER)Order,(CBLAS_TRANSPOSE)TransA,(CBLAS_TRANSPOSE)TransB,
            (int)M,(int)N,(int)K,alpha,aElems,(int)lda,bElems,(int)ldb,beta,cElems,(int)ldc);
     
        (*env)-> ReleaseDoubleArrayElements (env,C,cElems,0);
        (*env)-> ReleaseDoubleArrayElements (env,B,bElems,JNI_ABORT);
        (*env)-> ReleaseDoubleArrayElements (env,A,aElems,JNI_ABORT);
    }
```

This file should be compiled to create native library *libmkl_java_stubs.so* (Loading of this library in java is described in step 1)

```
    MKLPATH=/usr/intel/compilers_and_libraries/linux/mkl
    icc -shared -fPIC -o libmkl_java_stubs.so CBLAS.c -I. -I$MKLPATH/include -I/home/jinming/usr/include -Wl,--start-group $MKLPATH/lib/intel64/libmkl_intel_lp64.a $MKLPATH/lib/intel64/libmkl_intel_thread.a $MKLPATH/lib/intel64/libmkl_core.a -Wl,--end-group -qopenmp -lpthread -lm -ldl
```

#### 4. Create main dgemm.java
{:.no_toc}

```
    /*dgemm.java*/
    public final class dgemm {
        /** Incarnation prohibited. */
        private dgemm() {}
        /** No command-line options. */
        public static void main(String[] args) {
    
            //
            // Prepare the matrices and other parameters
            //
            int Order = CBLAS.ORDER.RowMajor;
            int TransA = CBLAS.TRANSPOSE.NoTrans;
            int TransB = CBLAS.TRANSPOSE.NoTrans;
            int M=2, N=4, K=3;
            int lda=K, ldb=N, ldc=N;
            double[] A = new double[] {1,2,3, 4,5,6};
            double[] B = new double[] {0,1,0,1, 1,0,0,1, 1,0,1,0};
            double[] C = new double[] {5,1,3,3, 11,4,6,9};
            double alpha=1, beta=-1;
            //
            // Print the parameters
            //
            System.out.println("alpha=" + string(alpha));
            System.out.println("beta=" + string(beta));
            printMatrix("Matrix A",A,M,K);
            printMatrix("Matrix B",B,K,N);
            printMatrix("Initial C",C,M,N);
            //
            // Compute the function
            //
            CBLAS.dgemm(Order,TransA,TransB,M,N,K,alpha,A,lda,B,ldb,beta,C,ldc);
            //
            // Print the result
            //
            printMatrix("Resulting C",C,M,N);
            //
            // Check the result:
            //
            boolean error=false;
            for (int m=0; m<M; m++)
                for (int n=0; n<N; n++)
                    if (C[m*N+n] != 0)
                        error=true;
            if (error)
                System.out.println("ERROR: resulting C must be zero!");
            //
            // Print summary and exit
            //
            if (error) {
                System.out.println("TEST FAILED");
                System.exit(1);
            }
            System.out.println("TEST PASSED");
        }
     
        /** Print the matrix X assuming raw-major order of elements. */
        private static void printMatrix(String prompt, double[] X, int I, int J) {
            System.out.println(prompt);
            for (int i=0; i<I; i++) {
                for (int j=0; j<J; j++)
                    System.out.print("\t" + string(X[i*J+j]));
                System.out.println();
            }
        }
    
        /** Shorter string for real number. */
        private static String string(double re) {
            String s="";
            if (re == (long)re)
                s += (long)re;
            else
                s += re;
            return s;
        }
    }
```

Compile the application with 

```
    javac dgemm.java CBLAS.java    #javac *.java
```

#### 5. Execute the application
{:.no_toc}
java.library.path should point to directory where library libmkl_java_stubs.so is placed. This example assumes that stubs shared library is located next to the created Java executable.
And ensure that you add the location of your *.class* file to your classpath. So, if its in the current folder then add . to your classpath. 

```
    java -Djava.library.path=. -classpath . dgemm
```

The output should be: 

```
    alpha=1
    beta=-1
    Matrix A
    	1	2	3
    	4	5	6
    Matrix B
    	0	1	0	1
    	1	0	0	1
    	1	0	1	0
    Initial C
    	5	1	3	3
    	11	4	6	9
    Resulting C
    	0	0	0	0
    	0	0	0	0
    TEST PASSED
```
