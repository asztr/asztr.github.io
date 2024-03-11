---
append-head-extra: '<header style="height:70px;">
  <div style="float:left;">
    <a href="../../index.html">
      <img width="30px" style="box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.55); border:2px solid #ffffff; padding:2px; border-radius:15px; box-shadow:" src="./img/home-button.png">
    </a>
  </div>
  <div style="text-align:center; float:none; font-size:22px; font-weight:300;">Statistical Analysis &mdash; Friedman Test</div>
</header>'
---

# Friedman Test

<div style="width:100%; padding:30px; background-color:rgb(237, 240, 249); text-align:justify; font-family:'Roboto'; font-weight:300; margin-bottom:30px;">
Friedman test is a non-parametric method to compare multiple classification algorithms over multiple datasets. Through ranking the algorithms over multiple datasets, it can determine whether there is a significant difference between them.
This article presents how to set up the test and what conditions have to be met, with a numerical example. The acompanying notebook can be downloaded from the following <a href="https://github.com/elifons/statistical_tests_for_ML/blob/c9374f37235e0f748eb5ca5a46f12d9c9faa9aae/1_Friedman-test.ipynb">link</a>.
</div>
<div style="padding:0px; line-height: 1.5; margin:0px; margin-bottom:20px; font-size:12px; text-align:center;">
	<span style="margin-right:20px;">
		<img width="30px" style="box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.55); border:1px solid #ffffff; padding:0px; border-radius:50%; margin-right:6px;" src="./img/eli-thumb2.jpeg">
			<a href="https://elifons.github.io/">Elizabeth Fons</a>
    </span>
    <span style="margin-right:20px;">
		<img width="30px" style="vertical-align:middle; box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.55); border:1px solid #ffffff; padding:0px; border-radius:50%; margin-right:6px;" src="./img/ale-thumb2.png">
			<a href="http://homepages.ucl.ac.uk/~ucacasz/">Alejandro Sztrajman</a>
	</span>
    <span style="color:#818181;"><img src="./img/calendar.svg" width="24px;" style="opacity:0.35; margin-right:6px;" valign="top">July 28, 2021</span>
</div>

Friedman Test is a non-parametric method to determine the significance of differences between multiple ($M$) classification algorithms evaluated over multiple ($N$) datasets. The first step in our analysis will be to do a hypothesis test to determine whether there is a significant difference in the performance of the classifiers. Our null hypothesis $H_0$ states that there is no difference between all classifiers, while the alternative hypothesis $H_A$ is that there is.  To test these hypotheses, Friedman ranks the algorithms per dataset and then compares the average ranks, as detailed below:

1. Rank each algorithm by their performance on each dataset. In case of ties, average ranks are assigned. Example: if in a given dataset we have classifiers with the following accuracies, $m_1=0.7$, $m_2=0.9$, $m_3=0.7$ and $m_4=0.5$ we can see that $m_1$ and $m_3$ are tied, $m_2$ has the highest accuracy and $m_4$ has the lowest, so the rankings would be: $r_1=2.5$, $r_2=1$, $r_3=2.5$ and $r_4=4$.

   

2. Calculate the average rank $R_j$ of each method over all $N$ datasets:
$$
R_j = \frac{1}{N}\sum_i r_{ji}\nonumber
$$

3. Calculate the Friedman statistic: 
	$$
	\chi_F^2 = \frac{12N}{M(M+1)}\left[\sum_j R_j^2 - \frac{M(M+1)^2}{4} \right].\nonumber
	$$
	
4. For large values of $M$ and $N$ (approximately $N>10$ and $M>5$), the Friedman statistic $\chi^2_F$ follows the $\chi^2$ distribution with $M-1$ degrees of freedom. Hence we need to search for the critical value of $\chi^2_{(M-1)}$ for a chosen significance level (typically $\alpha = 0.05$) in order to decide whether we can reject or not the null hypothesis. A $\chi^2$ distribution table can be found <a href="https://people.smp.uq.edu.au/YoniNazarathy/stat_models_B_course_spring_07/distributions/chisqtab.pdf">here</a>. When the conditions for $M$ and $N$ are not met, the following <a href="friedman-critical.html">table</a> of critical values should be used.$^{1}$

<b>Note:</b> Iman and Davenport$^2$ showed that Friedman's $\chi^2$ tends to be conservative (i.e., it may have a high likelihood of type II error) and thus derived the following statistic:
$$
F_F = \frac{(N-1) \chi^2_F}{N(M-1)-\chi^2_F}\nonumber
$$

which follows the $F$-distribution with $M-1$ and $(M-1)(N-1)$ degrees of freedom.

### Example

###### The full table reporting the accuracies for all classifiers on all datasets can be downloaded from this [link](http://www.timeseriesclassification.com/results.php).
Let's analyse a numerical example, using a subset of the classification accuracies of multiple classifiers on the UCR datasets, provided by the [UEA & UCR Time Series Classification Repository](http://www.timeseriesclassification.com/index.php)$^3$. For convenience, we will select only 5 classifiers from the table (<span style="font-variant:small-caps;">ts-chief, rocket, boss, weasel, catch22</span>) and 12 datasets (which correspond to the rows of the table).

|      | ts-chief | rocket | boss  | weasel | catch22 |
|:----:|:--------:|:------:|:-----:|:------:|:-------:|
| Beef |  0.632   | 0.760  | 0.612 | 0.740  |  0.473  |
| BME  |  0.996   | 0.997  | 0.866 | 0.948  |  0.905  |
| Car  |  0.879   | 0.912  | 0.848 | 0.834  |  0.746  |
| CBF  |  0.998   | 0.996  | 0.999 | 0.980  |  0.954  |
| Crop |  0.762   | 0.752  | 0.686 | 0.724  |  0.653  |
| Fish |  0.982   | 0.974  | 0.970 | 0.951  |  0.773  |
| Ham  |  0.805   | 0.855  | 0.837 | 0.821  |  0.694  |
| Meat |  0.984   | 0.989  | 0.981 | 0.977  |  0.943  |
| Rock |  0.832   | 0.805  | 0.803 | 0.855  |  0.705  |
| UMD  |  0.983   | 0.983  | 0.966 | 0.932  |  0.869  |
| Wine |  0.898   | 0.914  | 0.893 | 0.930  |  0.700  |
| Yoga |  0.873   | 0.914  | 0.910 | 0.892  |  0.804  |

The null hypothesis is that the accuracy is the same for all five classifiers and the alternative is that it is not:
$$
H_0: \text{the accuracy is the same for all five classifiers}\nonumber\\
H_A: \text{the accuracy is not the same for all five classifiers}
$$
Note that the alternative hypothesis is not that all classifiers have different accuracies $i.e., H_A: \theta_1 \neq \theta_2 \neq \cdots \neq \theta_5$ because this implies that all five means must differ from one another in order to reject the null hypothesis.

**Step 1:** We rank each algorithm on each dataset:

|      | ts-chief | rocket | boss | weasel | catch22 |
|:----:|:--------:|:------:|:----:|:------:|:-------:|
| Beef |    3     |   1    |  4   |   2    |    5    |
| BME  |    2     |   1    |  5   |   3    |    4    |
| Car  |    2     |   1    |  3   |   4    |    5    |
| CBF  |    2     |   3    |  1   |   4    |    5    |
| Crop |    1     |   2    |  4   |   3    |    5    |
| Fish |    1     |   2    |  3   |   4    |    5    |
| Ham  |    4     |   1    |  2   |   3    |    5    |
| Meat |    2     |   1    |  3   |   4    |    5    |
| Rock |    2     |   3    |  4   |   1    |    5    |
| UMD  |    1     |   2    |  3   |   4    |    5    |
| Wine |    3     |   2    |  4   |   1    |    5    |
| Yoga |    4     |   1    |  2   |   3    |    5    |

In the Beef datasets, ROCKET has the highest accuracy (0.76) thus it's ranked as $1^{st}$, while Catch22 has the lowest accuracy (0.47) and hence it's ranked as $5^{th}$. 

**Step 2:** We can now calculate the average rank of each method, which is simply the average of each individual column on the above table.

| Classifier | Avg rank |
|:----------:|:--------:|
| ts-chief   |   2.2    |
| rocket     |   1.7    |
| boss       |   3.2    |
| weasel     |    3     |
| catch22    |   4.9    |

We can see that TS-CHIEF and ROCKET have the lowest rankings, so they are the best performing classifiers, while Catch22 has the higher average ranking (close to 5) which seems to indicate that it's consistently the worst performing classifier. 

**Step 3:** Compute the Friedman statistic to decide whether the classifiers are significantly different. We have 12 datasets and 5 classifiers, thus $N=12$ and $M=5$:
$$
\chi_F^2 = \frac{12 \cdot 12}{5(5+1)}\left[(2.2^2+1.7^2+3.2^2+3^2+4.9^2) - \frac{5(5+1)^2}{4} \right] = 29.0\nonumber
$$

**Step 4:** The critical value for the $\chi^2$ distribution with 4 degrees of freedom for $\alpha=0.05$ is 9.487, so we can reject the null hypothesis (Reject $H_0$).

Finally, we can also compute the correction by Iman and Davenport$^{2}$:
$$
F_F = \frac{11\cdot29.0}{12\cdot4-29.0} = 16.79\nonumber
$$
The critical value for the $F$ distribution with $5-1=4$ and $(5-1)\cdot(12-1) = 44$ degrees of freedom for $\alpha=0.05$ is  $2.583$, thus rejecting $H_0$, consistently with the results from the Friedman statistic.

### Next steps

After applying the Friedman test, if the null hypothesis is rejected, we can proceed with a post-hoc test to establish which are the significant differences between the algorithms. We will explain possible post-hoc tests in future blog posts. 

### References

[1] Jerrold H. Zar. *Biostatistical Analysis. 5th ed.* Prentice-Hall/Pearson, 2010.

[2] Ronald L. Iman and James M. Davenport. Approximations of the critical region of the Friedman statistic. *Communications in Statistics*, pages 571–595, 1980.

[3] Anthony Bagnall, Jason Lines, William Vickers and Eamonn Keogh. The UEA & UCR Time Series Classification Repository, [www.timeseriesclassification.com](https://www.timeseriesclassification.com).

