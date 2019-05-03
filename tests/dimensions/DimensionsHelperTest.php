<?php

namespace go1\util\tests\dimensions;
use go1\util\schema\mock\DimensionsMockTrait;
use go1\util\dimensions\DimensionHelper;
use go1\util\tests\UtilCoreTestCase;
use go1\util\DateTime;

class DimesionsHelperTest extends UtilCoreTestCase
{
    use DimensionsMockTrait;

    public function testLoad()
    {
        $createdDate = DateTime::create('-2 day')->format(DATE_ISO8601);
        $modifiedDate = DateTime::create('-1 day')->format(DATE_ISO8601);

        $dimensionId = $this->createDimension($this->go1,
            [
                'parent_id' => 0,
                'name' => 'Design and Animation',
                'type' => '1',
                'created_date' => $createdDate,
                'modified_date' => $modifiedDate,
            ]
        );

        $dimension = DimensionHelper::load($this->go1, $dimensionId);

        $this->assertEquals(0, $dimension['parent_id']);
        $this->assertEquals('Design and Animation', $dimension['name']);
        $this->assertEquals('1', $dimension['type']);
        $this->assertEquals($createdDate, $dimension['createdDate']);
        $this->assertEquals($modifiedDate, $dimension['modifiedDate']);
    }

    public function testLoadMultiple()
    {
        $dimensionIds = array();

        array_push($dimensionIds, $this->createDimension($this->go1,
            [   
                'parent_id' => 0,
                'name' => 'Design and Animation',
                'type' => '1', 
                'created_date' => $createdDate,
                'modified_date' => $modifiedDate,
            ]
        ));
        array_push($dimensionIds, $this->createDimension($this->go1,
            [   
                'parent_id' => 0,
                'name' => 'Investment and Trading',
                'type' => '1', 
                'created_date' => $createdDate,
                'modified_date' => $modifiedDate,
            ]
        ));

        $dimensions = DimensionHelper::loadMultiple($this->go1, $dimensionIds);

        $this->assertEquals(2, count($dimensions));
        $this->assertEquals('Design and Animation', $dimensions[0]['name']);
        $this->assertEquals('Investment and Trading', $dimensions[1]['name']);
    }

    public function testLoadAllForType()
    {
        $this->createDimension($this->go1,
            [
                'parent_id' => 0,
                'name' => 'Design and Animation',
                'type' => '1',
                'created_date' => $createdDate,
                'modified_date' => $modifiedDate,
            ]
        );
        $this->createDimension($this->go1,
            [
                'parent_id' => 0,
                'name' => 'Investment and Trading',
                'type' => '1',
                'created_date' => $createdDate,
                'modified_date' => $modifiedDate,
            ]
        );

        $dimensions = DimensionHelper::loadAllForType($this->go1, '1');

        $this->assertEquals(2, count($dimensions));
        $this->assertEquals('Design and Animation', $dimensions[0]['name']);
        $this->assertEquals('Investment and Trading', $dimensions[1]['name']);
    }
}
